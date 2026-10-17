# Security and privacy: Keogh's Adventures

Last reviewed: 17 October 2026.

No system is ever "zero risk", and anyone who promises that is guessing. The goal here is **layers**: if one protection fails, the next one catches it. This file says what is done now, how it was tested, what depends on AWS and Stripe being set up, and what still carries risk.

> **The admin in this repo is a demo.** Its sign-in and data live in the visitor's own browser. Never enter real customer data. The public booking and contact forms show a "Prototype" notice and only accept Stripe's test card (`lib/base.ts`, `DEMO_MODE`). Real sign-in, storage and payments come with the backend below.
>
> **This GitHub repository is public.** It contains only demo data. A scan found no keys or passwords in the code or its history. Secret scanning, push protection and Dependabot security updates are switched on.

## Australian guidance this follows

| Source | Used for |
|---|---|
| [OAIC: Guide to securing personal information](https://www.oaic.gov.au/privacy/guidance-and-advice/guide-to-securing-personal-information) (APP 11) | Encryption, access controls, audit logs, third-party providers, destroying data, incident response, SPF/DKIM, keeping sensitive content off public servers |
| [OAIC: Notifiable Data Breaches scheme](https://www.oaic.gov.au/privacy/notifiable-data-breaches/about-the-notifiable-data-breaches-scheme) | Breach response plan; telling people and the OAIC when serious harm is likely |
| [ACSC: Essential Eight](https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/essential-eight/essential-eight-explained) | Patching, multi-factor sign-in, backups, least privilege |
| [ACSC ISM: Guidelines for software development](https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines/guidelines-for-software-development) | Validate all input, encode all output, Content-Security-Policy / HSTS / frame protection headers, server-side sessions, OWASP ASVS and Top 10 |
| [ACSC: Preventing web application access control abuse](https://www.cyber.gov.au/about-us/view-all-content/alerts-and-advisories/preventing-web-application-access-control-abuse) | Checking permissions on the server for every request |
| *Privacy Act 1988*, *Spam Act 2003*, PCI DSS, ATO record keeping | Consent, opt-in marketing, card data, 5-year payment records |

Honest note on sources: the OAIC pages were read directly. The ACSC pages were read through search summaries (one direct fetch timed out), so check specific control numbers against the current ISM release before quoting them in any formal document.

## Done now, in the code

| Protection | Where | Standard it serves |
|---|---|---|
| **Vulnerable packages: 0.** Next.js on the latest 15.5 patch; `postcss` and `sharp` pinned to patched versions. The deploy **stops** if a high or critical vulnerability is found (`npm audit` gate). Dependabot checks weekly. | `package.json`, `.github/` | Essential Eight: patch applications |
| **Strict script policy.** After each build, every page lists the exact fingerprints of its own scripts; nothing else may run, including injected code and `eval`. | `scripts/harden-csp.mjs`, `app/layout.tsx` | ISM: Content-Security-Policy |
| **Output encoding.** Admin text is escaped before display. Only `<em>` and `<b>` survive; structured-data scripts can't be closed early. | `lib/safeHtml.ts` | ISM: output encoding |
| **Input validation.** Email and AU phone checks, length limits on every field, number ranges (prices, days, seats, deposit %), control characters stripped, 5,000-character cap, dangerous object keys dropped, wrong-shaped saved data discarded. | `lib/utils.ts`, `lib/store.tsx`, admin pages | ISM: validate and sanitise all input |
| **Safe links.** Social links must be `https://`; `mailto:` and `tel:` links are built only from valid values; external links use `noopener noreferrer`. | `lib/safeHtml.ts` | OWASP |
| **Clickjacking guard.** If the site is shown inside another page, it stays blank. (Real headers replace this on proper hosting.) | `app/layout.tsx`, `globals.css` | ISM: frame protection |
| **Spam traps** on booking and contact forms. | forms | OWASP |
| **Card safety in the demo.** Card box accepts only Stripe's test card; browser autofill is off on card fields. | `book/[id]/page.tsx` | PCI DSS |
| **Privacy.** `/privacy` collection notice; privacy and terms consent required and recorded; marketing opt-in and unticked; contact details masked in admin until "Show"; delete-on-request. | `privacy/page.tsx`, admin | Privacy Act (APPs), Spam Act |
| **No tracking or outside services.** Fonts are self-hosted; the built site makes zero connections to other domains. | build | APP 8, privacy |
| **Build pipeline.** Deploy actions pinned to exact commits; minimum permissions per job; clean install with scripts off; no source maps shipped. | `.github/workflows/pages.yml` | Supply-chain safety |
| **Secrets.** `.env*` ignored; secret scanning and push protection on. | `.gitignore`, GitHub | OAIC / OWASP |
| **Ready for real hosting.** Header files for Amplify and CloudFront (HSTS, no-sniff, frame deny, referrer, permissions, same-origin isolation) and `security.txt`. | `customHttp.yml`, `infra/`, `public/.well-known/` | ISM: security headers |

## How it was tested (17 October 2026)

Tested in a real browser against a build made exactly like the deploy (`npm ci --ignore-scripts`, audit gate, build, strict-policy step).

- All 12 page types load and start up with **0 items blocked** by the policy, **0 script errors** and **0 connections to other domains**.
- Control test: an injected `<script>` and an `onerror` handler **run** with no policy and are **blocked** with the site's policy. Scripts added to the running page, scripts from other sites and `javascript:` links are blocked too. `eval()` and `new Function()` are blocked.
- Attack text planted in the saved data (script tags, `onerror` images, `javascript:` Facebook link, hidden-recipient email, `__proto__` key, 20,000-character field) is shown as harmless text or dropped; nothing runs.
- The site embedded in an attacker's page (normal and sandboxed frame) renders blank.
- Booking form: message under each bad field, spam trap stops bots, a real-looking card number is refused, Stripe's test card completes.

## Limits of GitHub Pages (today)

GitHub Pages can't send security headers, so HSTS, `frame-ancestors` and `X-Content-Type-Options` aren't available yet; the page-level policy and clickjacking guard cover what they can. HTTPS is enforced. Move to Amplify (`customHttp.yml`) or CloudFront (`infra/cloudfront-security-headers.json`) for the full set.

## When AWS and Stripe are set up

Everything in **ap-southeast-2 (Sydney)** so data stays in Australia.

**Accounts and access** (Essential Eight: restrict admin privileges; MFA)
- [ ] AWS account in Tony's business name; root user with MFA, then locked away
- [ ] Individual sign-ins (IAM Identity Center), MFA on every one, least-privilege roles, no shared logins
- [ ] CloudTrail (audit log) and GuardDuty (threat detection) on; billing alarm set
- [ ] Stripe account in Tony's name with 2-step sign-in

**Admin sign-in**
- [ ] Amazon Cognito with **MFA required** (authenticator app, not SMS), strong passphrases, lock-out after repeated failures
- [ ] Sessions managed on the server; admin API checks the token **and permissions on every request**
- [ ] Audit log: who viewed contact details, deleted data or changed prices, and when (stored where admins can't edit it)

**Data** (OAIC: encrypt, back up, destroy)
- [ ] RDS PostgreSQL: encrypted (KMS), not publicly reachable, daily backups kept 35 days, **restore tested**
- [ ] S3 for photos: block all public access; serve through CloudFront only
- [ ] Secrets (Stripe keys, DB password) in Secrets Manager, never in code
- [ ] Scheduled clean-up: contact details deleted 2 years after the trip; payment records kept 5 years then deleted

**Edge**
- [ ] CloudFront with HTTPS only (TLS 1.2+) and the headers in `infra/cloudfront-security-headers.json`
- [ ] AWS WAF: managed rules plus rate limits on booking, contact and sign-in
- [ ] Add Stripe to the policy when connected: `script-src https://js.stripe.com`, `frame-src https://js.stripe.com https://hooks.stripe.com`, `connect-src https://api.stripe.com`

**Payments**
- [ ] Cards only through Stripe Checkout or Elements; turn `NEXT_PUBLIC_DEMO_MODE=off`
- [ ] Verify the signature on every Stripe webhook; ignore unsigned or repeated events
- [ ] The server works out prices from its own database; **never trust a total sent by the browser**

**Email** (OAIC: SPF and DKIM)
- [ ] Verify keoghsadventures.com in SES with SPF, DKIM and DMARC; unsubscribe link in every marketing email

**People and process**
- [ ] Written **data breach response plan**: who decides, how to contain, assess serious harm, and notify the OAIC and affected people
- [ ] Check every supplier (AWS, Stripe, email) and keep their security terms on file
- [ ] Lawyer reviews `/privacy` and the booking terms
- [ ] **Independent penetration test before real customer data goes in**
- [ ] Monthly: `npm audit`, merge Dependabot updates, test a restore, review who has access

## Rules for the backend code

The browser checks in this repo are for convenience; **the server must repeat every one of them.**

1. Validate and limit every input on the server (type, length, range, format); reject, don't repair.
2. Use parameterised database queries only. Never build SQL from text. Select only the columns needed (no `SELECT *`). The app's database user can only read and write its own tables.
3. Encode all output; never put user text into HTML, URLs, emails or logs unescaped.
4. Check the signed-in user's permission on **every** request, not just at sign-in.
5. Protect state-changing requests against CSRF; rate-limit and bot-protect public forms.
6. Never log personal details, card data or secrets. Return generic error messages.
7. Keep Stripe event handling idempotent (safe to receive twice).

## Still carries risk

- Styles allow inline code (needed for the design). Style injection can't run code, but it is a weakness a strict policy would remove.
- The demo admin has no real authentication until Cognito is connected.
- Third-party services (Stripe, AWS, email) can have their own incidents; the plan above limits what they hold.
- New vulnerabilities appear all the time: weekly Dependabot checks and a monthly review are what keep this current.

## Reporting a problem

Email tony@keoghsadventures.com with the details (also at `/.well-known/security.txt` on the live domain). Please don't post security issues publicly.
