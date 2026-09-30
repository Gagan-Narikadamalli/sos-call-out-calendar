# SOS Parsippany Call-Out & Time-Off Portal

Next.js portal for Success On The Spectrum in Parsippany. Employees can submit PTO or non-PTO leave requests. Managers can use a calendar to review, edit, and delete submissions, add calendar-only notes for late arrivals/early departures/special occasions, review database usage, and bulk-delete old records.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Run `npm install`.
3. Run `npm run dev`.

The database tables and indexes are created automatically on the first request.

## Deploy to Vercel

Import this folder into Vercel, connect a Postgres database, and add `DATABASE_URL`, `MANAGER_PASSWORD`, and `AUTH_SECRET` to Production, Preview, and Development environments. Then deploy.

Public form: `/`  
Parsippany Manager Calendar: `/manager`

## Request and calendar behavior

Employees can submit PTO, 1/2 Day PTO, or Non-PTO / Out. Full-day and half-day PTO dates must be at least two calendar days after today in New Jersey. A reason is optional for PTO and required for Non-PTO / Out.

Managers can edit existing Called Out and Sick Leave records while keeping their original request type. The team calendar remains read-only.
