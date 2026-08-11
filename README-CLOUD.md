# Recruiting Board — Cloud Version (real accounts, works across devices)

This version has real login and syncs across devices — but that means
there are a few setup steps only you can do, since they involve creating
your own free accounts. I built everything up to that line; here's
exactly what's left, in order.

## What you're setting up

- **Supabase** (free tier) — a hosted database that stores each user's
  board and handles login/signup. You'll create one project and run one
  SQL script.
- **Vercel or Netlify** (free tier) — hosts the actual website.

Total time: ~20-25 minutes, all clicking through web pages, no coding.

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click "New Project." Pick any name and password (the password is for
   the database itself — you won't need it day-to-day).
3. Wait about a minute for the project to finish setting up.

## Step 2 — Create the database table

1. In your new project, open the **SQL Editor** (left sidebar).
2. Click "New query."
3. Open `schema.sql` from this folder, copy everything in it, paste it
   into the SQL editor, and click **Run**.
4. That creates the table your app will store data in, with security
   rules so each user can only ever see their own data.

## Step 3 — Get your project's API keys

1. In Supabase, go to **Settings → API**.
2. You'll see a **Project URL** and an **anon public** key. Copy both.
3. In this project folder, copy `.env.example` to a new file named
   `.env`, and paste your two values in:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-key-here
   ```

## Step 4 — Test it locally (optional but recommended)

If you have [Node.js](https://nodejs.org) installed:

```bash
npm install
npm run dev
```

Open the URL it prints, sign up with any email/password, and confirm
the board loads and saves. (Supabase will email a confirmation link —
check your inbox.)

## Step 5 — Put it on the internet

1. Create a free [GitHub](https://github.com) account if you don't have
   one, make a new repository, and upload this whole folder to it
   (GitHub's website has an "upload files" button — no command line
   needed).
   - **Important:** do NOT upload your `.env` file — GitHub should
     already ignore it (see `.gitignore`), but double-check it's not in
     the upload.
2. Go to [vercel.com](https://vercel.com), sign up, click "Add New
   Project," and pick your new GitHub repo.
3. Before deploying, open **Environment Variables** in the setup screen
   and add the same two values from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy. In a minute or two you'll get a live URL anyone can
   visit, sign up, and use — each person gets their own private,
   synced-across-devices board.

## What this version does NOT do

- No password reset flow is wired up yet (Supabase supports it, but the
  screen for it isn't built here).
- No admin view — you can't see who's signed up or manage users from
  the app itself (Supabase's dashboard shows you the raw user list if
  you ever need it).
- The 267-school directory is still baked into the code, same as the
  simple version — it's shared reference data, not something stored per
  user.
