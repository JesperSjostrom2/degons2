# Jesper Sjostrom Portfolio

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Create `.env.local` from `.env.example` if you want the contact form to send email locally.

## Environment Variables

All three are required for the contact form to send email:

`RESEND_API_KEY` — Resend API key.

`CONTACT_TO_EMAIL` — where contact messages are delivered.

`RESEND_FROM_EMAIL` — the sender address. Use a verified Resend domain sender in production, for example `Portfolio Contact <hello@yourdomain.com>`.

## Deploy on Vercel

Deploy as a standard Next.js project on Vercel.

Use these defaults:

```bash
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Add the environment variables from `.env.example` in Vercel before deploying if the contact form should work in production.
