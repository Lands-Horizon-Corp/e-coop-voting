# Architecture

A map of the codebase for developers. Setup is in [[environment]].

## Stack
Next.js 14.1 (App Router), TypeScript, Prisma 5 with PostgreSQL, next-auth (credentials), TanStack Query and Table, Tailwind with Radix/shadcn components, Zod for validation, and S3 for images.

## Folder map

| Folder | What lives there |
| --- | --- |
| `app/(authentication)/auth` | Login page (also creates the default root account on first visit) |
| `app/(private)/admin` | Admin UI: coops, branches, user-management, events and their sub pages |
| `app/(public)/events` | Public pages for members: event home, register, vote, claim |
| `app/api/auth` | next-auth handler |
| `app/api/v1/admin` | Admin API (protected by middleware) |
| `app/api/v1/public` | Member API (no admin login, uses its own cookies) |
| `app/api/v1/poller` | Cheap "has anything changed" endpoint for live refresh |
| `app/api/v1/upload` | Image upload |
| `components` | Shared UI (`ui/` is shadcn, plus data table, member search, modals) |
| `hooks/api-hooks`, `hooks/public-api-hooks` | TanStack Query hooks, one file per area |
| `services` | Server side helpers (auth, election, event, user, S3, claim checks) |
| `lib` | `auth.ts` (next-auth options and helpers), `database.ts` (Prisma client), `aws-s3.ts`, `mailer/` |
| `validation-schema` | Zod schemas shared by forms and API routes |
| `types` | Shared TypeScript types |
| `errors` | Error classes and the route error handler |
| `stores` | Zustand stores for modals and the QR scanner |
| `prisma` | `schema.prisma` and migrations |
| `public/email-templates` | Handlebars email templates |
| `cmd`, `tools` | One-off maintenance scripts, see [[scripts]] |

## Authentication and roles

### Admin side
- next-auth **credentials** provider with JWT sessions (`maxAge` 28000 seconds, about 7.8 hours). The login service is `services/auth.ts`.
- `middleware.ts` protects `/admin/*` and `/api/v1/admin/*` with `withAuth`.
- In API routes use `currentUserOrThrowAuthError()` (throws a 403) or `currentUserOrFalse()` from `lib/auth.ts`.
- Roles: `root`, `coop_root`, `admin`, `staff`. Page level checks use `isAllowed([...roles], user)` from `lib/utils.ts`. The sidebar list is `AdminRoutes` in `admin/_components/sidebar/sidebar-route.tsx`.
- **Data scoping** is done in the list routes (`branch`, `user`, `event`) by role: `root` sees all, `coop_root` filters by `coopId`, `admin` and `staff` by `branchId`. New list routes should follow the same `TConditionSet` pattern.
- The user role rules for who can edit whom are in `user-management/_components/role-utils.ts`.

### Member side
Members never log in. Short lived signed cookies are used instead, signed with `VOTING_AUTHORIZATION_SECRET`:

| Cookie | Set by | Purpose |
| --- | --- | --- |
| `v-auth` | `public/.../election/[electionId]/authorize-voter` (member) or `admin/.../assist-authorize-voter` (admin assisted, payload has `assisted: true`) | Lets `submit-vote` know which attendee is voting |
| `c-auth` | `public/.../claim/authorize-claim` | Authorizes incentive claims (OTP or birthday) |
| `recent-user` | `public/.../register` | Remembers the last registered passbook number |

Verification rules (OTP, birthday, eligibility) are in the two `authorize-voter` routes and follow the election settings. See [[member-voting]].

## Data model
Defined in `prisma/schema.prisma`.

```
Coop ─┬─ Branch ─┬─ User (role)
      │          └─ Event ─┬─ EventAttendees (members)  ← registered, voted, voteOtp, canVote, surveyed
      └─ Event             ├─ Election ─┬─ Position ─ Candidate
                           │            └─ Votes (attendee × candidate)
                           └─ Incentives ─┬─ IncentiveAssigned (user × incentive, quantity)
                                          └─ IncentiveClaims (attendee × incentive, releasedAt)
```

Things worth knowing:
- `EventAttendees` is the member list **per event**, unique on `(eventId, passbookNumber)`. Members are not shared across events.
- `Election` is one to one with `Event`. It holds the voting settings (`voteEligibility`, `voteConfiguration`, `voteScreenConfiguration`, `allowOTPVerification`, `allowBirthdayVerification`, `sendEmailVoteCopy`). See [[election]].
- `IncentiveClaims` is unique on `(incentiveId, eventAttendeeId)`, so a member claims each item once. `releasedAt` null means "Pending Release".
- Branch and Event deletes are **soft** (`deleted` flag). Coop and user deletes are hard, and cascade through `onDelete: Cascade`.
- The default for `Event.isRegistrationOpen` is `false`, and for `EventAttendees.canVote` is `true`.

## Conventions

### API routes
- Routes call `routeErrorHandler(e, req)` in `catch`. It maps `ZodError` to 400, `AuthenticationError` to 403, Prisma `P2002` to 409 and `P2025` to 400, and anything else to 500.
- Inputs are parsed with Zod schemas from `validation-schema/`, usually the same schema the form uses.
- Image routes take `multipart/form-data` with `data` (JSON) and `image` fields (see the coop routes).

### Front end
- One hook file per area in `hooks/api-hooks`, wrapping axios and TanStack Query. Mutations show toasts through `errors/mutation-error-handler.ts`.
- Tables use TanStack Table with `DataTable`, `DataTableColHeader`, `DataTableViewOptions` and `DataTablePagination`. Each list page follows the same `index.tsx` plus `column.tsx` split.
- Confirm dialogs go through `useConfirmModal`.

## Live updates (polling)
There is no websocket. Event sub data (registrations, votes, claims, assignments) updates `Event.subUpdatedAt` whenever it changes. Pages call `useEventSubDataUpdateStatus`, which polls `GET /api/v1/poller/event/{id}` every **3 seconds**, and refetch their data only when the timestamp moves (`useOnEventSubDataUpdate` in `hooks/use-event-update-poller.tsx`).

> When you add a write that other open screens should see, also set `subUpdatedAt` on the event, like the register, vote and claim routes do.

## Email
`lib/mailer/index.ts` renders Handlebars templates from `public/email-templates` and sends them in chunks of 100. The active provider is **Mailchimp Transactional** (`MailchimpMailer`). `ResendMailer` exists but `mails()` currently uses Mailchimp for both options. Mail is sent for OTPs (`admin/.../otp/*`) and vote copies (`submit-vote`).

## Image storage
`services/s3-upload.ts` and `lib/aws-s3.ts` upload to S3. The client side compresses images first (`hooks/use-image-pick.ts`, `browser-image-compression`). QR exports for members run in batches of `PB_QR_EXPORT_BATCH_SIZE` (500, `constants.ts`).

## Member search
Search by passbook number or by name uses `pg_trgm` GIN indexes (see the `20260320_add_trigram_indexes` migration). Name search expects `Lastname, Firstname`.
