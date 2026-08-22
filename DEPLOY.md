# Deploy Guide

Step-by-step instructions for putting Pizza Palace live: **Neon** (Postgres database),
**Render** (NestJS API), **Vercel** (Next.js web app), plus wiring the GitHub Actions
nightly-reset workflow. Every account, project, and token in this guide is something
*you* create and hold — Claude can't sign up for external services or handle real
credentials on your behalf, so this is written as a checklist for you to follow.

**Important — where secrets actually go:** nothing here gets committed to git or typed
into a repo `.env` file. Your local `apps/api/.env` stays exactly as it is today (local
Postgres, local dev secrets) — it's for local development only and is already
git-ignored. Every value below gets pasted into that *platform's own* dashboard
(Render's "Environment" tab, Vercel's "Environment Variables" settings, GitHub's repo
"Secrets" page). Keep a copy of anything you generate (JWT secrets, reset secret) in a
password manager, since you may need to reference it again later.

Do these in order — each step needs a value produced by the one before it.

---

## Step 1 — Neon (Postgres database)

1. Go to **https://neon.tech** and sign up (GitHub login is fine).
2. Create a new project — call it something like `pizza-palace`.
3. On the project dashboard, click **Connection Details**. Select the **Pooled
   connection** string (recommended — Render's free tier and serverless-style
   connections work better through Neon's pooler).
4. Copy the full connection string. It looks like:
   ```
   postgresql://<user>:<password>@<host>/<database>?sslmode=require
   ```
5. **Save this value** — you'll paste it into Render as `DATABASE_URL` in Step 2.

---

## Step 2 — Render (NestJS API)

1. Go to **https://render.com**, sign up, and connect your GitHub account. Authorize
   access to `mykhailiuk-chanel/exercise-automation-pizza-service`.
2. Click **New +** → **Web Service** → select the repo.
3. Configure the service:
   - **Name**: `pizza-palace-api`
   - **Root Directory**: leave blank (repo root) — this is a pnpm workspace, so
     commands below run from the root and use `pnpm --filter` to target the API.
   - **Runtime**: Node
   - **Build Command**:
     ```
     pnpm install --frozen-lockfile && pnpm --filter @pizza/api build
     ```
   - **Start Command**:
     ```
     pnpm --filter @pizza/api start:prod
     ```
   - **Instance Type**: Free to start (see the cold-start note at the bottom).
4. Add these **Environment Variables** (Render dashboard → your service →
   **Environment** tab → **Add Environment Variable**), one at a time:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string from Step 1 |
   | `WEB_ORIGIN` | placeholder for now (`http://localhost:3059`) — you'll update this in Step 4 once the Vercel URL exists |
   | `JWT_ACCESS_SECRET` | a long random string you generate now (e.g. run `openssl rand -base64 32` locally) — **do not reuse** the local dev placeholder value |
   | `JWT_REFRESH_SECRET` | another random string, different from the one above |
   | `JWT_ACCESS_EXPIRES_IN` | `15m` |
   | `JWT_REFRESH_EXPIRES_IN` | `30d` |
   | `ENABLE_TEST_UTILS` | `true` (keeps `/api/test/reset` and the "For Testers" credentials usable on the live site) |
   | `TEST_RESET_SECRET` | another random string — **save this one**, you'll need it again in Step 5 |

   Render sets its own `PORT` automatically — the app already reads
   `process.env.PORT ?? 3053`, so you don't need to add `PORT` yourself.
5. Before the live API has any data, run migrations + seed against the Neon database:
   - On your machine, temporarily point `apps/api/.env`'s `DATABASE_URL` at the Neon
     connection string from Step 1.
   - Run `pnpm --filter @pizza/api db:migrate` (creates the tables), then
     `pnpm --filter @pizza/api db:seed` (loads the catalog, coupons, demo accounts).
   - Change `apps/api/.env`'s `DATABASE_URL` back to your local Postgres URL
     afterward — don't leave it pointed at production.
6. Click **Deploy**. Render builds and gives you a live URL, e.g.:
   ```
   https://pizza-palace-api.onrender.com
   ```
   **Save this URL** — needed in Step 3 and Step 5.
7. Verify: open `https://<your-render-url>/api/v1/health` (should return
   `{"status":"ok",...}`) and `https://<your-render-url>/api/docs` (Swagger should load).

---

## Step 3 — Vercel (Next.js web app)

1. Go to **https://vercel.com**, sign up, connect GitHub, and import
   `mykhailiuk-chanel/exercise-automation-pizza-service`.
2. Configure the project:
   - **Root Directory**: `apps/web` (Vercel auto-detects it's part of a pnpm
     workspace and handles the rest).
   - **Framework Preset**: Next.js (auto-detected).
   - Leave the Install/Build commands on their defaults.
3. Add these **Environment Variables** (Project Settings → Environment Variables):

   | Key | Value |
   |---|---|
   | `API_URL` | the Render URL from Step 2 + `/api/v1`, e.g. `https://pizza-palace-api.onrender.com/api/v1` |
   | `NEXT_PUBLIC_API_URL` | same value as `API_URL` above |

   (Both are needed — `API_URL` is read server-side for prerendered pages, and
   `NEXT_PUBLIC_API_URL` is read client-side by the browser.)
4. Click **Deploy**. Vercel gives you a live URL, e.g.:
   ```
   https://exercise-automation-pizza-service.vercel.app
   ```
   **Save this URL.**

### Step 3.5 — Custom domain (optional)

Skip this entirely if the free `*.vercel.app` URL is good enough — nothing else in
this guide depends on it. If you want a specific address instead (e.g. something like
`automation-pizzaservice.com`):

1. **Buy the domain** from any registrar (Namecheap, Cloudflare Registrar, Squarespace
   Domains, etc.) — this is a separate purchase outside of Vercel/Render, and it's the
   one part of this whole guide you have to pay for.
2. In Vercel: your project → **Settings** → **Domains** → enter the domain name → **Add**.
3. Vercel shows you the DNS records to create. Typically:
   - Using the domain **apex** (e.g. `automation-pizzaservice.com`): add an **A record**
     pointing to the IP Vercel gives you.
   - Using a **subdomain** (e.g. `www.automation-pizzaservice.com` or
     `app.automation-pizzaservice.com`): add a **CNAME record** pointing to
     `cname.vercel-dns.com`.
4. Go to your registrar's DNS settings page and add whichever record Vercel showed you.
   DNS changes can take anywhere from a few minutes to a few hours to propagate.
5. Back in Vercel, the domain's status updates to "Valid" once it detects the DNS
   record — Vercel also provisions HTTPS for it automatically.
6. Once the custom domain is live, update `WEB_ORIGIN` on Render (Step 4 below) to
   this domain instead of the `*.vercel.app` one, so CORS matches whichever address
   you're actually sharing with testers.

---

## Step 4 — Close the loop: update CORS on Render

The API only accepts requests from the origin in `WEB_ORIGIN` — right now it's still
pointed at `localhost`.

1. Go back to Render → your API service → **Environment**.
2. Update `WEB_ORIGIN` to the real Vercel URL from Step 3.
3. Save — Render redeploys automatically with the new value.

---

## Step 5 — GitHub Actions secrets (nightly reset workflow)

1. In your GitHub repo: **Settings** → **Secrets and variables** → **Actions** →
   **New repository secret**.
2. Add:

   | Secret name | Value |
   |---|---|
   | `API_BASE_URL` | the Render URL from Step 2 (no trailing slash), e.g. `https://pizza-palace-api.onrender.com` |
   | `TEST_RESET_SECRET` | the exact same value you set on Render in Step 2 |

3. Test it manually: repo **Actions** tab → **Nightly Test Data Reset** workflow →
   **Run workflow** button. Confirm it succeeds (green check) before relying on it.
4. Once that's confirmed working, the `schedule:` trigger in
   `.github/workflows/nightly-reset.yml` can be turned back on (it's currently
   commented out for exactly this reason) — ask me to do that whenever you're ready,
   it's a one-line code change.

---

## Step 6 — Final verification checklist

- [ ] `https://<render-url>/api/v1/health` → `200 {"status":"ok"}`
- [ ] `https://<render-url>/api/docs` → Swagger UI loads
- [ ] `https://<vercel-url>` → homepage loads
- [ ] `https://<vercel-url>/menu` → shows real pizzas (proves Vercel can reach Render)
- [ ] Register → add address → checkout with a test card → order appears in order
      history, end-to-end on the live site
- [ ] `https://<vercel-url>/for-testers` → renders correctly, links work

---

## Notes

- **Cold starts**: Render's free tier spins the API down after inactivity — the first
  request after idle can take 30–60 seconds. This is expected (already flagged in
  `IMPLEMENTATION_PLAN.md`); a paid instance or a different host (e.g. Fly.io) avoids it
  if it becomes annoying.
- **Never commit real secrets** — the JWT secrets, `TEST_RESET_SECRET`, and the Neon
  connection string only ever live in Render's, Vercel's, and GitHub's own dashboards.
- Deploying doesn't change local development at all — `apps/api/.env` and
  `apps/web/.env.local` keep pointing at your local Postgres/API as before.
