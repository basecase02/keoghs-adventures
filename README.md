# Keogh's Adventures website

Next.js 15 (App Router, TypeScript) prototype of Tony Keogh's new booking website and admin.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Admin: http://localhost:3000/admin (prototype accepts any login).

## How it's organised

| Path | What it is |
|---|---|
| `app/(site)/` | Public pages: home, tours, tour detail, booking, about, trip news, contact |
| `app/admin/` | Admin: overview, bookings, tours & dates, website text, settings |
| `components/site`, `components/admin` | Shared pieces (header, footer, carousel, tour card, booking drawer) |
| `lib/seed.ts` | Starting data. Tours, prices and itineraries are real; bookings, guests and reviews are examples |
| `lib/store.tsx` | App state, saved in the browser for the demo. Swap for API calls in production |
| `public/img/` | Tony's photos, named by place |

## Scope (agreed simplifications)

- Admin changes the website (tours, prices, dates, itinerary, photos, home text, news, FAQs, reviews) and shows bookings.
- Enquiries are not stored in the admin. The contact form emails Tony directly.
- No guest accounts. Confirmations and balance payment links go out by email.

## Privacy and security (for production)

- Australian Privacy Principles: collection notice and recorded consent at checkout, data kept in AWS Sydney (ap-southeast-2), only the data needed for the trip.
- Spam Act 2003: marketing emails are opt-in, unticked by default.
- Card data never touches our servers (Stripe Checkout / Elements).
- Admin: two-step sign-in (Cognito MFA), contact details masked until revealed, reveals logged.
- Retention: payment records 5 years (ATO); guest contact details removed 2 years after the trip; "remove personal details" action in the booking drawer.

## Production plan

Next.js on AWS Amplify, API on Lambda + API Gateway, PostgreSQL on RDS, photos in S3, email via SES, Stripe webhooks for deposits, balances and failed payments.
