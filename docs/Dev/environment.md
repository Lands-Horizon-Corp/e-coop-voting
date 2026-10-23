# Environment

How to run the app locally and what each environment variable does. Backups and restores are in [[backing up]]. How the code is organised is in [[architecture]].

## Requirements
- **Node 20.x** (set in `package.json` `engines`)
- **PostgreSQL 16** (the repo ships a Docker Compose file)
- An S3 compatible bucket for images (optional for basic local work)
- npm, or bun (`bun.lock` is committed alongside `package-lock.json`)

## Quick start

```bash
# 1. database (Postgres 16.6 on host port 5433)
docker compose up -d

# 2. env file
cp .env.example .env      # then fill it in, see the table below

# 3. dependencies and Prisma client
npm install
npm run db-generate

# 4. apply the schema
npm run db-migrate        # dev: creates and applies migrations
# or: npx prisma migrate deploy   (apply existing migrations only)

# 5. run
npm run dev               # http://localhost:3000
```

### Local database
`docker-compose.yml` starts one service, `db`:

| Setting | Value |
| --- | --- |
| Image | `postgres:16.6` |
| Host port | `5433` (container `5432`) |
| User / password / database | `postgres` / `acedb25` / `ace-system` |
| Volume | `pg_data` |

These are local development defaults only. So the matching `DATABASE_URL` is:

```
postgresql://postgres:acedb25@localhost:5433/ace-system
```

Never reuse these credentials outside local development.

### First login
There is no sign-up. The first time `/auth` is opened and no `root` user exists, the app creates a default coop (**Main Cooperatives**), a **main branch** and a **root** account (`cooperatives.cloud@gmail.com`). Ask the team for its password, or replace the password hash in the `User` table. Then create the rest from the admin pages (see [[using-the-app]]).

> Don't delete the default coop. The root user belongs to it.

## Environment variables
Copy `.env.example` to `.env`. Never commit `.env`.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Prisma | Postgres connection string |
| `NEXTAUTH_URL` | next-auth | The site's base URL, for example `http://localhost:3000` |
| `NEXTAUTH_SECRET` | next-auth | Signs admin session JWTs. Use a long random string |
| `VOTING_AUTHORIZATION_SECRET` | Voting and claiming | Signs the `v-auth` (voter) and `c-auth` (claimer) cookies. Used in the voting and claim API routes |
| `DEPLOYMENT_URL` | Emails | Public site URL, used to build links and image URLs inside vote copy emails |
| `AWS_S3_ENDPOINT` | Image upload | S3 compatible endpoint |
| `AWS_S3_REGION` | Image upload | Falls back to `auto` |
| `AWS_S3_BUCKET_NAME` | Image upload | Bucket for coop, branch, user, event and candidate images |
| `AWS_S3_ACCESS_KEY_ID` | Image upload | |
| `AWS_S3_SECRET_ACCESS_KEY` | Image upload | |
| `EMAIL_SENDER` | Emails | The "from" address |
| `MAILCHIMP_API_KEY` | Emails | Mailchimp Transactional. This is the mailer actually used for OTP and vote copy emails |
| `RESEND_API_KEY` | Emails | Resend. Implemented but not the active mailer |
| `FUNC_MAX_DURATION` | Serverless time limit | Seconds. Sets `maxDuration` of the OTP broadcast and QR bulk export routes (`constants.ts`) |
| `MAILER_SEND_*`, `NODEMAILER_*` | | Listed in `.env.example` but not read by the code |

### Checks when something breaks
- **Login loops or "unauthorized"**: `NEXTAUTH_URL` or `NEXTAUTH_SECRET` is missing or wrong.
- **Voting or claiming says "You dont have system credentials"**: `VOTING_AUTHORIZATION_SECRET` is missing, or the browser blocks cookies. In production the cookies are `secure`, so use HTTPS.
- **Images fail to upload**: check all five `AWS_S3_*` values.
- **OTP or vote copy emails don't arrive**: check `MAILCHIMP_API_KEY` and `EMAIL_SENDER`, and that the member has an email address.

## Database commands

| Script | Runs | Use |
| --- | --- | --- |
| `npm run db` | `prisma studio` | Browse and edit data |
| `npm run db-migrate` | `prisma migrate dev` | Create and apply a migration during development |
| `npm run db-generate` | `prisma generate` | Rebuild the Prisma client after schema changes |
| `npm run db-push` | `prisma db push` | Push the schema without a migration (throwaway databases only) |
| `npm run db-reset` | `prisma migrate reset` | **Wipes** the database and reapplies all migrations |

The migration `20260320_add_trigram_indexes` enables the `pg_trgm` extension and adds GIN indexes for member search (name and passbook number). Your Postgres user must be allowed to run `CREATE EXTENSION`.

## Build and deploy
- `npm run build` runs `prisma generate` then `next build`. ESLint is ignored during builds (`next.config.mjs`).
- `npm run vercel-build` also runs `prisma migrate deploy`, so migrations apply on every Vercel deploy.
- `vercel.json` pins the region to `hkg1`.
