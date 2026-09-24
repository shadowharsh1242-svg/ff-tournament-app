# FF Tournament App

A free-entry Free Fire tournament platform: player app + admin panel, running on Supabase (auth + database) and a points ledger instead of real money.

Live deployment, Supabase project, and env vars were provisioned automatically. See Vercel and Supabase dashboards for URLs and keys.

## Local development
```bash
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev
```

## Make yourself an admin
Sign up once in the app, then in Supabase Table Editor -> profiles, set your row's `role` to `admin`.

## Why points instead of real money
Real-money deposits/withdrawals require a licensed payment operator and gaming-law compliance. This build runs entirely on non-cash points so it can be launched and iterated on immediately.
