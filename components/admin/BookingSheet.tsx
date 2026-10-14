"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import type { Booking } from "@/lib/types";
import { TODAY, balanceDue, daysBetween, fmtDate, fmtDay, maskEmail, maskPhone, money, paidOf, seatsLeft, statusOf, typeLabel } from "@/lib/utils";
import { useAdmin } from "./AdminShell";

const DOCS = [["terms", "Booking terms", "Agreed when they booked"], ["medical", "Medical form", "Sent to them by secure link"], ["vehicle", "Vehicle check", "Due 2 weeks before the trip"]] as const;

export default function BookingSheet({ id }: { id: string }) {
  const { s, update } = useStore();
  const { toast, confirm } = useUI();
  const { closeSheet } = useAdmin();
  const [show, setShow] = useState(false);
  const b = s.bookings.find((x) => x.id === id);
  if (!b) return null;
  const c = s.customers.find((x) => x.id === b.customerId)!;
  const t = s.tours.find((x) => x.id === b.tourId)!;
  const d = t.departures.find((x) => x.id === b.depId)!;
  const [k, l] = statusOf(b);
  const paid = paidOf(b);
  const { owed, date } = balanceDue(s, b);
  const removed = c.name === "Details removed";
  const mut = (fn: (bk: Booking) => void) => update((st) => fn(st.bookings.find((x) => x.id === id)!));

  const cancel = async () => {
    if (!(await confirm({ title: "Cancel this booking?", text: "Their seats go back on sale straight away. Any refund is done in Stripe.", ok: "Yes, cancel it", danger: true }))) return;
    update((st) => {
      const bk = st.bookings.find((x) => x.id === id)!; const dd = st.tours.find((x) => x.id === bk.tourId)!.departures.find((x) => x.id === bk.depId)!;
      dd.booked = Math.max(0, dd.booked - bk.guests); if (dd.status === "full" && seatsLeft(dd) > 0) dd.status = "open"; bk.status = "cancelled";
    });
    toast("Booking cancelled");
  };
  const erase = async () => {
    if (!(await confirm({ title: "Delete this guest's personal details?", text: "Their name, email and phone are deleted for good. The payment record is kept because the ATO needs it for 5 years.", ok: "Delete details", danger: true }))) return;
    update((st) => { Object.assign(st.customers.find((x) => x.id === b.customerId)!, { name: "Details removed", email: "removed@invalid", phone: "", city: "", vehicle: "—", notes: "" }); });
    toast("Personal details deleted");
  };

  const needsMoney = b.status === "failed" || (b.status === "deposit" && owed > 0);

  return (
    <div className="sheet-bg" onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={`Booking for ${c.name}`}>
        <div className="sh"><h2>{c.name}</h2><span className={`pillst ${k}`}>{l}</span><button className="closex" onClick={closeSheet} aria-label="Close"><Icon.close /></button></div>
        <div className="sb">
          <div className="acard">
            <dl className="kv">
              <dt>Trip</dt><dd>{t.name}</dd>
              <dt>Leaves</dt><dd>{fmtDay(d.date)}<br /><small style={{ color: "var(--ink-3)" }}>in {daysBetween(TODAY, d.date)} days</small></dd>
              <dt>People</dt><dd>{b.guests} · {typeLabel(b.style)}</dd>
              <dt>Booking no.</dt><dd>{b.id}</dd>
            </dl>
          </div>

          <div className="acard">
            <h2>Money</h2>
            <div className="big-money">
              <div><small>Paid</small><b style={{ color: "var(--ok)" }}>{money(paid)}</b></div>
              <div><small>{b.status === "cancelled" ? "Trip total" : "Still to pay"}</small><b>{b.status === "cancelled" ? money(b.total) : money(owed)}</b></div>
            </div>
            <div className={`meter ${owed <= 0 ? "ok" : ""}`}><i style={{ width: `${Math.min(100, (paid / b.total) * 100)}%` }} /></div>
            {b.status === "failed" && <p style={{ color: "#b13a30", fontWeight: 600 }}>Their card was declined. Send them a new payment link.</p>}
            {b.status === "deposit" && owed > 0 && <p style={{ color: "var(--ink-3)" }}>Balance due {fmtDate(date)}. We remind them by email automatically.</p>}
          </div>

          <div className="acard">
            <h2>Contact</h2>
            {removed ? <p style={{ color: "var(--ink-3)" }}>This guest&apos;s details have been deleted.</p> : show ? (
              <dl className="kv"><dt>Email</dt><dd>{c.email}</dd><dt>Phone</dt><dd>{c.phone || "—"}</dd></dl>
            ) : (
              <div className="hidden-note"><span>{maskEmail(c.email)} · {maskPhone(c.phone)}</span><button className="btn btn-soft btn-sm" onClick={() => { setShow(true); toast("Details shown. This is recorded for privacy."); }}><Icon.eye /> Show</button></div>
            )}
          </div>

          <div className="acard">
            <h2>Forms</h2>
            <p className="help">Tap a form once you&apos;ve received it.</p>
            <div className="checklist">{DOCS.filter(([dk]) => b.docs[dk] !== null).map(([dk, dl, hint]) => (
              <button key={dk} className={b.docs[dk] ? "done" : ""} onClick={() => { mut((bk) => { bk.docs[dk] = !bk.docs[dk]; }); }}>
                <span className="bx">{b.docs[dk] && <Icon.tick />}</span><span>{dl}<small>{b.docs[dk] ? "Received" : hint}</small></span>
              </button>
            ))}</div>
          </div>

          <details className="more">
            <summary>More options ▾</summary>
            <div className="stack">
              <p className="small" style={{ color: "var(--ink-3)" }}>Agreed to privacy notice on {fmtDate(b.consent.privacy)} · {b.consent.marketing ? "Happy to get new-date emails" : "No marketing emails"}</p>
              {b.status !== "cancelled" && <button className="btn btn-danger" onClick={cancel}>Cancel this booking</button>}
              {!removed && <button className="btn btn-soft" onClick={erase}>Delete their personal details</button>}
            </div>
          </details>
        </div>
        <div className="sf">
          {needsMoney
            ? <button className="btn btn-primary btn-lg btn-block" onClick={() => toast(`Payment link emailed to ${c.name.split(" ")[0]}`)}>Email them a payment link</button>
            : <button className="btn btn-dark btn-lg btn-block" onClick={closeSheet}>Done</button>}
        </div>
      </div>
    </div>
  );
}
