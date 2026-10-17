import { safeMailto, safeTel } from "@/lib/safeHtml";
import Link from "next/link";
import type { Metadata } from "next";
import { SEED } from "@/lib/seed";
import { BASE } from "@/lib/base";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Keogh's Adventures collects, uses, stores and protects your personal information under the Australian Privacy Principles.",
  alternates: { canonical: "/privacy" },
};

// DRAFT for legal review. Written to the Australian Privacy Principles (Privacy Act 1988 (Cth)).
const UPDATED = "17 October 2026";

const PROMISES = [
  ["Kept in Australia", "Stored on secure servers in Sydney."],
  ["Never sold", "Used only to run your trip."],
  ["No card numbers", "Payments go straight to Stripe."],
  ["Yours to control", "See, fix or delete your details any time."],
];

const COLLECT = [
  ["Your name, email and mobile", "When you book", "To confirm your trip and keep in touch"],
  ["Trip, date, travel style, number of people", "When you book", "To hold your seats"],
  ["Your vehicle (optional)", "When you book a tag-along trip", "To check it suits the track"],
  ["Payment record: amount, date, card type and last 4 digits", "When you pay", "To track deposits and balances"],
  ["Your consent choices", "When you book", "To show you agreed to this policy and our terms"],
  ["Medical questionnaire", "Before your trip, by secure link", "To keep you safe. Only with your consent"],
  ["Name, email and message", "When you contact us", "To reply to you"],
];

const SECTIONS = [
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["share", "Who we share it with"],
  ["safe", "How we keep it safe"],
  ["keep", "How long we keep it"],
  ["rights", "Your rights"],
  ["breach", "If something goes wrong"],
  ["contact", "Questions or complaints"],
];

export default function PrivacyPage() {
  const st = SEED.settings;
  return (
    <>
      <section className="phead"><img src={`${BASE}/img/stock-campfire-stars.jpg`} alt="" style={{ objectPosition: "60% 92%" }} /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><span>Privacy</span></div>
        <h1 className="t-hero">Your privacy, <em>plainly</em>.</h1>
        <p>What we collect, why, and how we look after it. Last updated {UPDATED}.</p>
      </div></section>

      <section className="sec s-paper light" style={{ paddingTop: "clamp(40px,5vw,64px)" }}><div className="wrap">
        <div className="pv-promises">
          {PROMISES.map(([h, p]) => <div key={h}><b>{h}</b><span>{p}</span></div>)}
        </div>

        <div className="pv">
          <nav className="pv-toc" aria-label="On this page">
            <span className="kicker">On this page</span>
            <ol>{SECTIONS.map(([id, l]) => <li key={id}><a href={`#${id}`}>{l}</a></li>)}</ol>
          </nav>

          <div className="pv-body">
            <p className="lede">{st.legalName} runs small-group 4WD tours in Western Australia. We follow the Australian Privacy Principles in the <i>Privacy Act 1988</i> (Cth). This page is also our collection notice for bookings and enquiries.</p>

            <section id="collect">
              <h2 className="t-2">What we collect</h2>
              <div className="pv-table">
                <table>
                  <thead><tr><th>What</th><th>When</th><th>Why</th></tr></thead>
                  <tbody>{COLLECT.map(([w, when, why]) => <tr key={w}><td>{w}</td><td data-label="When">{when}</td><td data-label="Why">{why}</td></tr>)}</tbody>
                </table>
              </div>
              <p className="pv-note">We never ask for passports, dates of birth or bank details, and there are no advertising trackers on this site.</p>
            </section>

            <section id="use">
              <h2 className="t-2">How we use it</h2>
              <p>Only to run your trip: confirming your booking, taking payments, sending reminders and trip details, keeping you safe and answering your questions. If you tick the box, we&apos;ll email you about new dates. Every email has an unsubscribe link.</p>
            </section>

            <section id="share">
              <h2 className="t-2">Who we share it with</h2>
              <ul className="ticks">
                <li><span><b>Stripe</b> processes card payments.</span></li>
                <li><span><b>Amazon Web Services, Sydney</b> hosts the website, bookings and emails.</span></li>
                <li><span><b>Campgrounds, stations and permit offices</b> get only the names needed to book your place.</span></li>
                <li><span><b>Emergency services</b>, only if your safety requires it.</span></li>
              </ul>
            </section>

            <section id="safe">
              <h2 className="t-2">How we keep it safe</h2>
              <ul className="ticks">
                <li>Encrypted when sent and when stored</li>
                <li>Card numbers handled only by Stripe (PCI DSS Level 1)</li>
                <li>Two-step sign-in for our admin</li>
                <li>Contact details hidden in our admin until needed</li>
              </ul>
            </section>

            <section id="keep">
              <h2 className="t-2">How long we keep it</h2>
              <div className="pv-pair">
                <div><b>2 years</b><span>after your trip, then contact details are deleted</span></div>
                <div><b>5 years</b><span>for payment records, as the ATO requires</span></div>
              </div>
            </section>

            <section id="rights">
              <h2 className="t-2">Your rights</h2>
              <p>You can ask to see, correct or delete the information we hold about you, except records the law says we must keep. We&apos;ll respond within 30 days.</p>
            </section>

            <section id="breach">
              <h2 className="t-2">If something goes wrong</h2>
              <p>If a data breach is likely to cause you serious harm, we&apos;ll tell you and the Office of the Australian Information Commissioner (OAIC), as the Notifiable Data Breaches scheme requires.</p>
            </section>

            <section id="contact" className="pv-contact">
              <h2 className="t-2">Questions or complaints</h2>
              <p>Talk to Tony first. If you&apos;re not happy with the answer, you can contact the OAIC at oaic.gov.au or 1300 363 992.</p>
              <div className="row">
                <a className="btn btn-primary" href={safeMailto(st.email)}>{st.email}</a>
                <a className="btn btn-ghost" href={safeTel(st.phone)}>{st.phone}</a>
              </div>
            </section>
          </div>
        </div>
      </div></section>
    </>
  );
}
