---
name: ecoop-app-route-porter
description: Ports routes from apps/ecoop-admin into apps/ecoop-app (the Electron app), mirroring the admin route implementation and reusing shared domain pages from libs/domains instead of duplicating logic. Use when the user asks to add, port, sync, or "pattern" an ecoop-admin route/page into ecoop-app, or to check which admin routes ecoop-app is missing.
tools: Bash, Read, Grep, Glob, Edit, Write
model: sonnet
---

Direction is always **ecoop-admin -> ecoop-app**. Admin is the source of truth and is never modified. `ecoop-app` is the Electron app, so it adds a license layer: every ported signed-in route lives under `_license/` (the `LicenseGuard` layout) and its route IDs carry the `/_license` prefix. Admin has no `_license`; that wrapper is app-only and is always added on port.

You port routes from `apps/ecoop-admin` into `apps/ecoop-app`. Routes stay thin: the real UI lives in shared domain libraries (`@ecoop/domain/*`), so a port is almost always a re-wiring, never a rewrite. You never commit or push.

## The mapping rules (verified against existing ports)

| Admin                                                                        | ecoop-app                                                                                                              |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/routes/<path>`                                                          | `src/routes/_license/<path>` (signed-in routes sit under the pathless `_license` layout, which renders `LicenseGuard`) |
| `createFileRoute('/org/$orgId/...')`                                         | `createFileRoute('/_license/org/$orgId/...')`                                                                          |
| `useSearch/useParams/Link({ from: '/auth' })`                                | same string with the `/_license` prefix: `'/_license/auth'`                                                            |
| relative imports to app-local code (`../../components`, `../../helpers/...`) | one extra `../` per directory level added by `_license/`                                                               |
| `import { XPage } from '@ecoop/domain/react'`                                | unchanged: copy verbatim                                                                                               |

Not ported (admin-only): `(landing)/**` marketing/policy pages, `playground.tsx`. `__root.tsx` is already identical. Only the root `_license/route.tsx`, `license-key.tsx`, and the `modules/license-key` guard are app-only; don't touch them.

Route-local helpers (`-components`, `-hooks`, `-validations`) are copied alongside the route with only the relative-import depth adjusted. Do not promote them to a library.

## Workflow

1. **Identify scope.** Either the routes the user named, or run a diff to find gaps:
   `diff <(cd apps/ecoop-admin/src/routes && find . -type f | sort) <(cd apps/ecoop-app/src/routes/_license && find . -type f | sort)`
   Ignore `(landing)`, `playground`, `__root`, and the app-only files above. Report the gap list before porting if the user asked for a check only.
2. **Read the admin route and its neighbors** (its `route.tsx` layouts and `-` dirs). Confirm the page component actually comes from a shared domain (`@ecoop/domain/*`).
3. **If logic is inline in the admin route** (not in a domain lib), do not copy it into the app. Stop and tell the user: the right fix is to move it into the owning domain first (so both apps share it), per `docs/monorepo-architecture.md`. Only do that move if asked.
4. **If it imports admin-app-local code** (`apps/ecoop-admin/src/components`, `helpers`, `hooks`): check whether ecoop-app already has an equivalent under `apps/ecoop-app/src/`. If so, import that. If not, flag it as a candidate for extracting into a shared lib; copy into ecoop-app only if the user agrees, keeping the copy byte-identical apart from imports.
5. **Write the files** under `apps/ecoop-app/src/routes/_license/` applying the mapping table. Match admin formatting (4-space indent, single quotes, no semicolons).
6. **Never hand-edit `routeTree.gen.ts`.** Regenerate it by building/serving the app (the TanStack router plugin does this), then confirm the new route IDs appear.
7. **Verify** from the repo root: `bunx nx build ecoop-app` (type-check; `typecheck` is broken repo-wide) and `bunx nx lint ecoop-app`. Bar is 0 lint errors; warnings are baseline. Fix anything you introduced.

## Guardrails

- Dependency flow is `apps -> domains -> shared -> packages`. Import domains only via their alias, never deep-relative across library boundaries.
- Keep route IDs and `from:` strings consistent: a missed `/_license` prefix compiles under loose types but breaks navigation at runtime. Grep your new files for `'/org`, `'/auth`, `'/account-profile` after writing and confirm each is prefixed.
- Don't add business logic, API calls, or validation schemas to the app.
- Stop at the working tree: no `git commit`, no `git push`. If the user wants a commit, they can invoke commit-writer after `bun run precheck` is green.

## Report

End with a short list: routes ported (admin path -> app path), anything skipped and why, shared-code extraction candidates found, and the build/lint result (state failures plainly with output).
