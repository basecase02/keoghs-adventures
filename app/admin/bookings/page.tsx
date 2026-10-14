"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import { useAdmin } from "@/components/admin/AdminShell";
import type { Booking } from "@/lib/types";
import { TODAY, balanceDue, daysBetween, fmtDate, fmtDay, initials, money, seatsLeft } from "@/lib/utils";

type View = "trips" | "owing" | "paid";

export default function BookingsPage() {
  const { s } = useStore();
  const { openBooking } = useAdmin();
  const [view, setView] = useState<View>("trips");
  const [q, setQ] = useState("");

  const live = s.bookings.filter((b) => b.status !== "cancelled");
  const problems = live.filter((b) => b.status === "failed");
  const owing = live.filter((b) => b.status === "deposit");
  const paid = live.filter((b) => b.status === "paid");
  const toCome = owing.reduce((t, b) => t + balanceDue(s, b).owed, 0) + problems.reduce((t, b) => t + b.total, 0);

  const cust = (id: string) => s.customers.find((c) => c.id === id)!;
  const match = (b: Booking) => !q || `${cust(b.customerId).name} ${b.id}`.toLowerCase().includes(q.toLowerCase());

  /** One sentence Tony can read at a glance. */
  const status = (b: Booking): { tone: "ok" | "warn" | "bad" | "muted"; text: string } => {
    if (b.status === "failed") return { tone: "bad", text: "Card declined, needs a new payment link" };
    if (b.status === "cancelled") return { tone: "muted", text: "Cancelled" };
    if (b.status === "paid") return { tone: "ok", text: "All paid" };
    const { owed, date } = balanceDue(s, b); const d = daysBetween(TODAY, date);
    return { tone: d <= 30 ? "warn" : "muted", text: `Owes ${money(owed)} by ${fmtDate(date)}` };
  };

  // Group live bookings by trip date, soonest first.
  const groups = useMemo(() => {
    const m = new Map<string, Booking[]>();
    live.filter(match).forEach((b) => { const k = `${b.tourId}|${b.depId}`; m.set(k, [...(m.get(k) || []), b]); });
    return [...m.entries()].map(([k, bs]) => {
      const [tid, did] = k.split("|"); const t = s.tours.find((x) => x.id === tid)!; const d = t.departures.find((x) => x.id === did)!;
      return { t, d, bs };
    }).sort((a, b) => a.d.date.localeCompare(b.d.date));
  }, [live, q, s.tours]); // eslint-disable-line react-hooks/exhaustive-deps

  const Row = ({ b, showTrip }: { b: Booking; showTrip?: boolean }) => {
    const c = cust(b.customerId); const st = status(b); const t = s.tours.find((x) => x.id === b.tourId)!; const d = t.departures.find((x) => x.id === b.depId)!;
    return (
      <button className="guest" onClick={() => openBooking(b.id)}>
        <span className="g-av">{initials(c.name)}</span>
        <span className="g-main">
          <b>{c.name}</b>
          <small>{showTrip ? `${t.short} · ${fmtDate(d.date)} · ` : ""}{b.guests} {b.guests > 1 ? "people" : "person"} · {b.style === "ride" ? "riding with you" : "own 4WD"}</small>
        </span>
        <span className={`g-st ${st.tone}`}>{st.tone === "ok" && <Icon.tick />}{st.tone === "bad" && <Icon.alert />}{st.text}</span>
        <span className="g-go"><Icon.arrow /></span>
      </button>
    );
  };

  return (
    <>
      <div className="ahead">
        <h1>Bookings</h1>
        <p>Who&apos;s coming on each trip, and who still has something to pay. Tap anyone to see more.</p>
      </div>

      <div className="bsum">
        <div><b>{live.length}</b><span>bookings</span></div>
        <div><b>{live.reduce((n, b) => n + b.guests, 0)}</b><span>people coming</span></div>
        <div><b>{money(toCome)}</b><span>still to come in</span></div>
      </div>

      {problems.filter(match).length > 0 && (
        <section className="attn">
          <h2><Icon.alert /> Needs you</h2>
          {problems.filter(match).map((b) => <Row key={b.id} b={b} showTrip />)}
        </section>
      )}

      <div className="btools">
        <div className="seg2" role="tablist">
          {([["trips", "By trip"], ["owing", `Still owing · ${owing.length}`], ["paid", `All paid · ${paid.length}`]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={view === k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{l}</button>
          ))}
        </div>
        <label className="bsearch"><Icon.search /><input type="search" placeholder="Find a guest" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a guest" /></label>
      </div>

      {view === "trips" && (groups.length ? groups.map(({ t, d, bs }) => {
        const left = seatsLeft(d); const pct = Math.round((d.booked / d.seats) * 100);
        return (
          <section key={d.id} className="tripgrp">
            <header>
              <img src={t.cover} alt="" />
              <div className="th">
                <span className="when">{fmtDay(d.date)} · in {daysBetween(TODAY, d.date)} days</span>
                <h2>{t.name}</h2>
                <div className="seatbar"><div className="meter"><i style={{ width: `${pct}%` }} /></div><span>{d.booked} of {d.seats} seats taken{left > 0 ? ` · ${left} left` : " · full"}</span></div>
              </div>
            </header>
            <div className="glist">{bs.map((b) => <Row key={b.id} b={b} />)}</div>
          </section>
        );
      }) : <div className="acard empty-state">No bookings match &ldquo;{q}&rdquo;.</div>)}

      {view !== "trips" && (
        <section className="tripgrp">
          <div className="glist">
            {(view === "owing" ? owing : paid).filter(match).sort((a, b) => balanceDue(s, a).date.localeCompare(balanceDue(s, b).date)).map((b) => <Row key={b.id} b={b} showTrip />)}
            {!(view === "owing" ? owing : paid).filter(match).length && <div className="empty-state">Nobody here.</div>}
          </div>
        </section>
      )}

      <p className="small" style={{ color: "var(--ink-3)" }}>Cancelled bookings are kept for your records and don&apos;t show here.</p>
    </>
  );
}
