# KS Digital admin setup

The customer workspace and administrator console are separate:

- Customer workspace: `/customer`
- Private administrator console: `/admin`

## Required server-side environment variables

Configure these in the Vercel project settings (Preview first, then Production only when you approve a release):

- `KS_ADMIN_PASSWORD` — a long, unique admin password. Do not use a public or reused password.
- `KS_ADMIN_SESSION_SECRET` — a random secret with at least 32 bytes of entropy.
- `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service-role key for the project used by this app. This must be a server-only variable and must never use the `NEXT_PUBLIC_` prefix.
- `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL already used by the customer app.

The admin API checks a signed, HTTP-only session cookie on every order read/update. The service-role key is only read in server route handlers. Customer-facing code must never receive it.

## What is connected

- The Orders section reads `public.project_requests` from Supabase and can update its `status` field after admin authentication.
- Overview and Analytics use those database rows. Request totals are not revenue, and a quote request is not proof of payment.
- The QR section creates a QR code for the currently deployed site URL.

## Provider-dependent features

Live payment collection, automatic email/SMS notifications, cloud file delivery, persistent CRM leads, and support tickets need their respective provider configuration and database tables/policies. The admin console labels these as setup-dependent instead of pretending a payment or notification has happened.

## Safe rollout

Use a Preview deployment and test the admin login, order listing, status updates, and customer access separation before promoting anything to Production. Do not expose the service-role key in browser code or allow anonymous users to list all customer orders.
