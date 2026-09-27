# Deploying this project

Two separate services, on two separate hosts — not because it's more complex than
necessary, but because the backend genuinely needs a long-running Node process:

- **Frontend → Vercel.** A static Vite build with client-side routing. Exactly what
  Vercel is built for.
- **Backend → Render** (not Vercel). This backend uses **Socket.io** for the Lab's
  live-activity feature and keeps a persistent MongoDB connection open. Vercel's
  serverless functions are short-lived and stateless — Socket.io's WebSocket
  connections don't survive that, and a fresh Mongoose connection on every cold
  start is slow and wasteful. Render (or Railway, Fly.io — anything that runs a
  normal always-on Node server) is the correct fit; Vercel isn't, for this specific
  stack, regardless of how good it is for the frontend.

I can't click "Deploy" for you — that needs your Vercel/Render accounts, which I
have no access to — but every file and value below is exactly what those two
dashboards will ask for.

## 0. Prerequisite: a MongoDB database

The site works without one (it falls back to the static project list and skips
storage), but the admin panel, blog, contact inbox, and analytics all need it.

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (username + a strong, generated password).
3. Under Network Access, add `0.0.0.0/0` (allow from anywhere). Render's free tier
   doesn't offer a static outbound IP, so this is the practical option here — it's
   the database user's password that actually protects the data, so make it long
   and random, not something memorable.
4. Copy the connection string (`mongodb+srv://...`) — this is your `MONGODB_URI`.

## 1. Backend → Render

1. Push this repo to GitHub (done).
2. In Render: **New → Blueprint**, connect the repo. Render will read
   `backend/render.yaml` (already in this repo) and scaffold the service.
   (No Blueprint support / prefer manual setup? **New → Web Service** instead, then
   set: Root Directory `backend`, Build Command `npm install && npm run build`,
   Start Command `npm start`, Runtime `Node`.)
3. Fill in the environment variables Render prompts for (from the Blueprint's
   `sync: false` entries), or add them manually if you set the service up by hand:

   | Variable | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | from step 0 |
   | `CORS_ORIGINS` | leave a placeholder for now (e.g. `https://example.com`) — you'll update this in step 3 once you know your real Vercel URL |
   | `JWT_SECRET` | a random 32+ character string — generate one with `openssl rand -hex 32` |
   | `CONTACT_RATE_LIMIT_PER_HOUR` | `5` |
   | `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` / `EMAILJS_PUBLIC_KEY` / `EMAILJS_PRIVATE_KEY` | from your EmailJS account (Account → API Keys for the private key) |

4. Deploy. Render gives you a URL like `https://zohaib-portfolio-backend.onrender.com`
   — copy it, you'll need it in step 2.
5. Once it's live, create your one admin account by running this **locally**,
   pointed at the production database (not committed anywhere, run once):
   ```bash
   cd backend
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' MONGODB_URI='<paste the same URI>' npm run create-admin
   ```

## 2. Frontend → Vercel

1. In Vercel: **Add New → Project**, import the same GitHub repo.
2. Set **Root Directory** to `frontend` (this is a monorepo — Vercel needs to know
   which subfolder is the actual site). Framework Preset should auto-detect as Vite;
   Build Command `npm run build`, Output Directory `dist` — these are Vite's
   defaults, but confirm them if Vercel doesn't infer them.
3. Add these environment variables (Project Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://<your-render-url>/api` |
   | `VITE_SOCKET_URL` | `https://<your-render-url>` (no `/api`) |
   | `VITE_SITE_URL` | your Vercel URL once you know it (e.g. `https://zohaib.vercel.app`) — used for SEO tags and the generated sitemap |

4. Deploy. Vercel gives you the real frontend URL.

## 3. Close the loop

Now that both URLs are real:

1. Back in Render, update `CORS_ORIGINS` to your actual Vercel URL (comma-separated
   if you have more than one, e.g. a custom domain and the `.vercel.app` one — no
   trailing slash on either), then redeploy the backend so it takes effect.
2. If you changed `VITE_SITE_URL` after the first deploy, redeploy the frontend too
   (it's baked into the build at build time, not read at runtime).

## 4. Verify

- Visit the frontend URL — the homepage 3D world should load.
- `/contact` — send a real test message; it should reach your email via EmailJS
  and (if MongoDB is connected) show up under `/admin/messages`.
- `/lab` — the "Live activity" experiment should say `LIVE — 1 VIEWER ONLINE`
  rather than "NOT CONNECTED." If it doesn't, double-check `VITE_SOCKET_URL` and
  that `CORS_ORIGINS` on Render includes your exact frontend origin.
- `/admin/login` — sign in with the account from step 1.5.

## Custom domain (optional)

Point your domain at Vercel for the frontend (Vercel's dashboard walks through the
DNS records). The backend can stay on its `onrender.com` subdomain indefinitely —
visitors only ever talk to your custom domain; it's your frontend's API calls that
go to Render in the background, so the backend's URL being unbranded doesn't matter
to anyone using the site.