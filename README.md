# Her Clinic — Dr. Reham Mohamed

A bilingual (EN/AR) luxury beauty clinic website with a built-in admin
dashboard, Supabase backend, and analytics.

## Stack

- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS, Cormorant Garamond + Cairo, custom rose-gold palette
- **Animation**: Framer Motion + Lenis smooth scroll
- **i18n**: next-intl (EN, AR)
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Analytics**: Vercel Analytics + an internal `page_visits` table
- **Charts**: Recharts

## Project setup

### 1. Install

```bash
npm install
```

### 2. Configure Supabase

Set these on Vercel **and** in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # required for image uploads + analytics
ANALYTICS_SECRET=<random-32+chars>        # optional, hardens session-hash salt
ANTHROPIC_API_KEY=sk-ant-api03-...        # required for the public concierge chatbot
```

> **Note:** if you previously added `anonpublic` as a stray Vercel env var,
> delete it. We standardize on `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

### 3. Apply the database schema

In the Supabase SQL editor, run these in order:

1. `supabase/migrations/0001_init.sql` — schema, RLS, storage buckets
2. `supabase/seed.sql` — initial cases (unpublished), services, testimonials, settings
3. `supabase/migrations/0002_chatbot.sql` — FAQ table + chatbot settings

### 4. Create your admin

In **Supabase Dashboard → Authentication → Users**, click *Add user* and set
an email + password.

Then in the SQL editor, promote that user to admin:

```sql
update profiles set role='admin' where email='you@example.com';
```

### 5. Run

```bash
npm run dev
```

Public site lives at `http://localhost:3000/en` (or `/ar`).
Admin lives at `http://localhost:3000/admin`.

## What the admin can do

- **Submissions** — view, filter, search, mark contacted, add notes, delete, CSV export.
- **Analytics** — daily traffic, top pages, locales, referrers, devices, peak hours.
- **Before/After cases** — create, edit EN+AR copy, upload before/after images, reorder, publish.
- **Services** & **Testimonials** — same CRUD + publish flow.
- **FAQ** — bilingual question/answer pairs the chatbot leans on.
- **Chatbot** — toggle on/off, edit greeting, persona/tone, and suggested questions.
- **Branding** — replace `logo.svg` and `logo-mark.svg` (instantly reflected on the site).
- **Settings** — contact info, working hours, social links.

## Public-site concierge chatbot

A floating "Chat with us" button appears in the bottom corner of every public
page when `chatbot.enabled` is true. It uses **Claude Haiku 4.5** with prompt
caching on a system prompt assembled from everything you publish (services,
before/after cases, testimonials, FAQ, contact info, working hours, social),
so the chatbot answers in the user's language with up-to-date clinic data —
no separate retraining or sync step. Replies stream in real time over a
plain-text endpoint at `POST /api/chat`.

## Project layout

```
app/
  [locale]/      # bilingual public site
  admin/         # admin dashboard (LTR English, gated by Supabase Auth)
    _actions/    # Server Actions (auth, submissions, cases, services, …)
    content/     # CRUD pages
    submissions/ analytics/ settings/
  api/
    track/route.ts                       # POST /api/track  (analytics)
    admin/submissions/export/route.ts    # GET CSV export
components/
  admin/         # admin UI components
  *.tsx          # public site components
lib/
  supabase/      # browser, server, admin clients + types
  auth.ts        # requireAdmin, getProfile
  site-data.ts   # public RSC data fetchers (with translation fallback)
  validators.ts  # zod schemas
  hash.ts ua.ts utils.ts csv.ts
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Deployment

1. Push to GitHub.
2. Import the repo in Vercel.
3. Set the env vars in Step 2 above.
4. Deploy. Vercel Analytics auto-records Web Vitals; the in-DB `page_visits`
   table fills as visitors browse and powers the admin charts.
