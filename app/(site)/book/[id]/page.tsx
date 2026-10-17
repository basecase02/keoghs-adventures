"use client";
import { tourPath, useRouteId } from "@/lib/routes";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import { DEMO_MODE, TEST_CARD } from "@/lib/base";
import type { TravelStyle } from "@/lib/types";
import { isEmail, isName, isPhone, validate, TODAY, addDays, depositOf, fmtDate, fmtDay, fmtShort, lowestPrice, money, nextDeparture, seatsClass, seatsLeft, seatsText, typeLabel, uid } from "@/lib/utils";

interface Draft {
  step: 1 | 2 | 3 | 4; depId: string; style: TravelStyle; guests: number; vehicles: number; pay: "deposit" | "full";
  first: string; last: string; email: string; phone: string; vehicle: string;
  privacy: boolean; terms: boolean; marketing: boolean; card: string; ref?: string;
}
const STEPS = ["Trip", "Your details", "Payment"];

function BookInner() {
  const id = useRouteId();
  const q = useSearchParams();
  const { s, update } = useStore();
  const { toast } = useUI();
  const t = s.tours.find((x) => x.id === id);
  const [b, setB] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [hp, setHp] = useState(""); // spam trap: real people never see or fill this

  useEffect(() => {
    if (!t || b) return;
    const dep = t.departures.find((d) => d.id === q.get("dep") && seatsLeft(d) > 0) || nextDeparture(t);
    setB({ step: 1, depId: dep?.id || "", style: t.types.includes("tag") ? "tag" : "ride", guests: 2, vehicles: 1, pay: "deposit", first: "", last: "", email: "", phone: "", vehicle: "", privacy: false, terms: false, marketing: false, card: DEMO_MODE ? "4242 4242 4242 4242" : "" });
  }, [t, b, q]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [b?.step]);

  if (!t) return <section className="sec s-paper light book-page"><div className="wrap"><h1 className="t-1">Tour not found</h1><Link className="link" href="/tours">See all tours</Link></div></section>;
  if (!b) return <section className="sec s-paper book-page" style={{ minHeight: "100svh" }} />;

  const set = (p: Partial<Draft>) => { setB({ ...b, ...p }); const k = Object.keys(p)[0]; if (k && errs[k]) setErrs((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const Err = ({ k }: { k: string }) => errs[k] ? <span className="err" id={`e-${k}`} role="alert">{errs[k]}</span> : null;
  const inv = (k: string) => (errs[k] ? { "aria-invalid": true, "aria-describedby": `e-${k}` } : {});
  const dep = t.departures.find((d) => d.id === b.depId);
  const unit = t.price[b.style] || lowestPrice(t);
  const total = unit * b.guests;
  const deposit = depositOf(s, total);
  const due = b.pay === "full" ? total : deposit;
  const balDate = dep ? addDays(dep.date, -s.settings.balanceDueDays) : "";
  const deps = t.departures.filter((d) => d.date >= TODAY).sort((a, c) => a.date.localeCompare(c.date));

  const toDetails = () => {
    if (!dep || seatsLeft(dep) === 0) return toast("That date is sold out. Please pick another.", "bad");
    set({ step: 2, guests: Math.min(b.guests, seatsLeft(dep)) });
  };
  const toPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return; // a bot filled the hidden field
    const e2 = validate(b, {
      first: (v) => (!v.trim() ? "Please add your first name." : !isName(v) ? "Please use letters only." : null),
      last: (v) => (!v.trim() ? "Please add your last name." : !isName(v) ? "Please use letters only." : null),
      email: (v) => (!v.trim() ? "Please add your email." : !isEmail(v) ? "That doesn't look like an email. Check for a typo, e.g. name@gmail.com" : null),
      phone: (v) => (!v.trim() ? "Please add your mobile." : !isPhone(v) ? "Please enter an Australian number like 0412 345 678, or +country code if overseas." : null),
      privacy: (v) => (!v ? "Please tick to agree to the privacy notice." : null),
      terms: (v) => (!v ? "Please tick to accept the booking terms." : null),
    }) as Record<string, string>;
    setErrs(e2);
    const first = Object.keys(e2)[0];
    if (first) { document.getElementById(`b-${first}`)?.focus(); return toast(Object.keys(e2).length > 1 ? "Please fix the highlighted fields." : e2[first], "bad"); }
    set({ step: 3 });
  };
  const payNow = () => {
    // Demo only: refuse anything but Stripe's test card, so a real card number can never be entered here.
    if (DEMO_MODE && b.card.replace(/\D/g, "") !== TEST_CARD) return toast("Demo only: please use the test card 4242 4242 4242 4242. Never enter a real card.", "bad");
    setBusy(true);
    setTimeout(() => {
      let ref = "";
      update((st) => {
        const dd = st.tours.find((x) => x.id === t.id)!.departures.find((x) => x.id === b.depId)!;
        ref = `KA-2026-0${434 + st.bookings.length}`;
        let cust = st.customers.find((c) => c.email.toLowerCase() === b.email.toLowerCase());
        if (!cust) { cust = { id: uid("c"), name: `${b.first} ${b.last}`.trim(), email: b.email.trim(), phone: b.phone.trim(), city: "", vehicle: b.vehicle || "—", trips: 0, since: TODAY, notes: "" }; st.customers.push(cust); }
        st.bookings.unshift({
          id: ref, tourId: t.id, depId: dd.id, customerId: cust.id, style: b.style, guests: b.guests, vehicles: b.style === "tag" ? b.vehicles : 0, created: TODAY,
          status: b.pay === "full" ? "paid" : "deposit", total,
          payments: [{ id: uid("py_"), date: TODAY, amount: due, method: "Card •••• " + (b.card.replace(/\D/g, "").slice(-4) || "4242"), status: "succeeded", stripe: uid("pi_") }],
          docs: { terms: true, medical: false, vehicle: b.style === "tag" ? false : null },
          consent: { privacy: new Date().toISOString(), marketing: b.marketing, terms: "23 Jan 2025" }, notes: "",
        });
        dd.booked += b.guests; if (seatsLeft(dd) === 0) dd.status = "full";
      });
      setBusy(false); set({ step: 4, ref });
    }, 1100);
  };

  if (b.step === 4) return (
    <section className="sec s-paper light book-page"><div className="wrap" style={{ maxWidth: 720 }}>
      <div className="box done">
        <div className="tick"><Icon.tick /></div>
        <h1 className="t-1">You&apos;re booked, {b.first}</h1>
        <div className="ref">{b.ref}</div>
        <p className="lede" style={{ marginInline: "auto" }}>Your confirmation and receipt are on the way to <b style={{ color: "var(--ink)" }}>{b.email}</b>. Tony will call you within a day to say g&apos;day.</p>
        <div className="next">
          <div><i>1</i><span><b style={{ color: "var(--ink)" }}>Check your email</b><br />Confirmation, receipt and packing list.</span></div>
          <div><i>2</i><span><b style={{ color: "var(--ink)" }}>{b.style === "tag" ? "Book your vehicle check" : "Send us your flights"}</b><br />{b.style === "tag" ? "Outback Service Check, due two weeks before you leave." : "We'll arrange your airport pickup."}</span></div>
          <div><i>3</i><span><b style={{ color: "var(--ink)" }}>{b.pay === "full" ? "Nothing more to pay" : `Balance due ${balDate && fmtDate(balDate)}`}</b><br />{b.pay === "full" ? "You're all set." : "We'll email a secure payment link two weeks before."}</span></div>
        </div>
        <Link className="btn btn-dark" href="/tours">Back to tours</Link>
      </div>
    </div></section>
  );

  return (
    <section className="sec s-paper light book-page" style={{ minHeight: "100svh" }}><div className="wrap">
      <div className="crumbs dark" style={{ marginBottom: 14 }}><Link href="/tours">Tours</Link><span>/</span><Link href={tourPath(t.id)}>{t.short}</Link><span>/</span><span>Book</span></div>
      <div className="steps">{STEPS.map((x, i) => <span key={x} style={{ display: "contents" }}>{i > 0 && <i />}<span className={i + 1 < b.step ? "done" : i + 1 === b.step ? "on" : ""}><b>{i + 1}</b>{x}</span></span>)}</div>
      <div className="booking">
        <div className="stack" style={{ gap: 16 }}>
          {b.step === 1 && <>
            <div className="box"><h2>Date</h2><div className="stack" style={{ gap: 8 }}>{deps.map((d) => { const l = seatsLeft(d); return (
              <button key={d.id} className={`dep ${d.id === b.depId ? "on" : ""}`} disabled={l === 0} onClick={() => set({ depId: d.id, guests: Math.min(b.guests, l) })}>
                <span><b>{fmtDay(d.date)}</b><small>{d.note || (t.days > 1 ? `${t.days} days, back ${fmtShort(addDays(d.date, t.days - 1))}` : "Day trip")}</small></span>
                <span className={`seats ${seatsClass(l)}`}>{seatsText(l)}</span>
              </button>); })}</div></div>
            <div className="box"><h2>How you&apos;ll travel</h2><div className="stack" style={{ gap: 8 }}>{t.types.map((x) => (
              <button key={x} className={`opt ${b.style === x ? "on" : ""}`} onClick={() => set({ style: x })}><span className="dot" /><span><b>{typeLabel(x)}</b><small>{x === "ride" ? "A seat in our Patrol. Meals, gear and bedding included." : "Drive your own prepared 4WD in the convoy."}</small></span><span className="amt num">{money(t.price[x])}</span></button>
            ))}</div></div>
            <div className="box"><h2>Who&apos;s coming</h2>
              <div className="row between"><span>Travellers<br /><small className="muted">{dep ? `${seatsLeft(dep)} seats left on this date` : ""}</small></span>
                <span className="qty"><button aria-label="Fewer travellers" onClick={() => set({ guests: Math.max(1, b.guests - 1) })}>−</button><span>{b.guests}</span><button aria-label="More travellers" onClick={() => set({ guests: Math.min(dep ? Math.max(1, seatsLeft(dep)) : 1, b.guests + 1) })}>+</button></span></div>
              {b.style === "tag" && <div className="row between"><span>Vehicles</span>
                <span className="qty"><button aria-label="Fewer vehicles" onClick={() => set({ vehicles: Math.max(1, b.vehicles - 1) })}>−</button><span>{b.vehicles}</span><button aria-label="More vehicles" onClick={() => set({ vehicles: Math.min(s.settings.maxGroup, b.vehicles + 1) })}>+</button></span></div>}
            </div>
            <div className="row between"><Link className="link" href={tourPath(t.id)}>Back to the tour</Link><button className="btn btn-primary btn-lg" onClick={toDetails}>Continue</button></div>
          </>}

          {b.step === 2 && <form className="stack" style={{ gap: 16 }} noValidate onSubmit={toPayment}>
            <div className="box"><h2>Lead traveller</h2>
              {DEMO_MODE && <div className="note"><Icon.info /><span><b>Prototype.</b> Nothing you type here is sent to a server. Please use made-up details, not real ones.</span></div>}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" value={hp} onChange={(e) => setHp(e.target.value)} />
              <div className="form">
                <div className="field"><label htmlFor="b-first">First name</label><input type="text" id="b-first" maxLength={60} {...inv("first")} value={b.first} onChange={(e) => set({ first: e.target.value })} autoComplete="given-name" /><Err k="first" /></div>
                <div className="field"><label htmlFor="b-last">Last name</label><input type="text" id="b-last" maxLength={60} {...inv("last")} value={b.last} onChange={(e) => set({ last: e.target.value })} autoComplete="family-name" /><Err k="last" /></div>
                <div className="field"><label htmlFor="b-email">Email</label><input type="email" inputMode="email" id="b-email" maxLength={254} {...inv("email")} value={b.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /><Err k="email" /></div>
                <div className="field"><label htmlFor="b-phone">Mobile</label><input type="tel" id="b-phone" maxLength={20} {...inv("phone")} value={b.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="04xx xxx xxx" /><Err k="phone" /></div>
                {b.style === "tag" && <div className="field full"><label htmlFor="bv">Vehicle <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></label><input type="text" id="bv" maxLength={80} value={b.vehicle} onChange={(e) => set({ vehicle: e.target.value })} placeholder="e.g. LandCruiser 79, 2019" /></div>}
              </div>
              <p className="small muted">We only ask for what we need to run your trip. Other travellers&apos; details and the medical questionnaire come later, through a secure link.</p>
            </div>
            <div className="consent">
              <label className="check"><input type="checkbox" id="b-privacy" checked={b.privacy} onChange={(e) => set({ privacy: e.target.checked })} /> <span>I&apos;ve read the <Link href="/privacy" target="_blank" rel="noopener noreferrer">privacy collection notice</Link> and agree to Keogh&apos;s Adventures using these details to manage my booking.</span></label><Err k="privacy" />
              <label className="check"><input type="checkbox" id="b-terms" checked={b.terms} onChange={(e) => set({ terms: e.target.checked })} /> <span>I accept the <Link href="/contact">booking terms</Link>, including the deposit and cancellation policy.</span></label><Err k="terms" />
              <label className="check"><input type="checkbox" checked={b.marketing} onChange={(e) => set({ marketing: e.target.checked })} /> <span>Email me when new dates are released. Optional, and you can unsubscribe any time.</span></label>
              <p className="cn">Your details are stored in Australia, never sold, and only used for this trip. You can ask to see, correct or delete them at any time.</p>
            </div>
            <div className="row between"><button type="button" className="link" onClick={() => set({ step: 1 })}>Back</button><button className="btn btn-primary btn-lg" type="submit">Continue to payment</button></div>
          </form>}

          {b.step === 3 && <>
            <div className="box"><h2>Pay today</h2><div className="stack" style={{ gap: 8 }}>
              <button className={`opt ${b.pay === "deposit" ? "on" : ""}`} onClick={() => set({ pay: "deposit" })}><span className="dot" /><span><b>{s.settings.depositPercent}% deposit</b><small>Balance of {money(total - deposit, 2)} due {balDate && fmtDate(balDate)}</small></span><span className="amt num">{money(deposit, 2)}</span></button>
              <button className={`opt ${b.pay === "full" ? "on" : ""}`} onClick={() => set({ pay: "full" })}><span className="dot" /><span><b>Pay in full</b><small>Nothing more to pay later</small></span><span className="amt num">{money(total)}</span></button>
            </div></div>
            <div className="box"><h2>Card</h2>
              <div className="card-box">
                <div className="field"><label htmlFor="cn">Card number</label><input type="text" id="cn" inputMode="numeric" autoComplete="off" maxLength={23} placeholder="4242 4242 4242 4242" value={b.card} onChange={(e) => set({ card: e.target.value })} /></div>
                <div className="form"><div className="field"><label htmlFor="ce">Expiry</label><input type="text" id="ce" autoComplete="off" maxLength={7} placeholder="MM / YY" /></div><div className="field"><label htmlFor="cc">Security code</label><input type="text" id="cc" autoComplete="off" maxLength={4} placeholder="CVC" /></div></div>
              </div>
              <div className="secure"><Icon.lock /><span>{DEMO_MODE ? "Demo mode: no card is charged. Use the Stripe test card 4242 4242 4242 4242 and never a real card." : "Card details go straight to Stripe and are never seen or stored by us."}</span></div>
            </div>
            <div className="row between"><button type="button" className="link" onClick={() => set({ step: 2 })}>Back</button><button className="btn btn-primary btn-lg" disabled={busy} onClick={payNow}>{busy ? "Processing…" : `Pay ${money(due, 2)}`}</button></div>
          </>}
        </div>

        <aside className="summary">
          <div className="ph"><img src={t.cover} alt="" /></div>
          <span className="t">{t.name}</span>
          <div className="line"><span>Date</span><b>{dep ? fmtDate(dep.date) : "—"}</b></div>
          <div className="line"><span>{typeLabel(b.style)}</span><b>{b.guests} × {money(unit)}</b></div>
          <div className="line total"><span>Total</span><b className="num">{money(total)}</b></div>
          <div className="line"><span>{b.pay === "full" ? "Due today" : `Deposit today`}</span><b className="num" style={{ color: "var(--ochre)" }}>{money(due, 2)}</b></div>
          <div className="secure"><Icon.lock /><span>Secure checkout by Stripe</span></div>
        </aside>
      </div>
    </div></section>
  );
}

export default function BookPage() {
  return <Suspense><BookInner /></Suspense>;
}
