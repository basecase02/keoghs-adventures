"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import { useAdmin } from "@/components/admin/AdminShell";
import { TODAY, balanceDue, daysBetween, fmtDay, money, monthKey, seatsLeft, upcomingDeps } from "@/lib/utils";

function Trend({ now, before }: { now: number; before: number }) {
  const p = before ? Math.round(((now - before) / before) * 100) : 0;
  return <span className={`t ${p > 0 ? "up" : p < 0 ? "dn" : ""}`}>{p > 0 ? "▲" : p < 0 ? "▼" : "•"} {Math.abs(p)}% vs last month</span>;
}

export default function AdminHome() {
  const { s } = useStore();
  const { openBooking } = useAdmin();
  const live = s.bookings.filter((b) => b.status !== "cancelled");
  const takings = (mk: string) => s.bookings.flatMap((b) => b.payments).filter((p) => p.status === "succeeded" && monthKey(p.date) === mk).reduce((t, p) => t + p.amount, 0);
  const newBookings = (mk: string) => live.filter((b) => monthKey(b.created) === mk).length;
  const ups = upcomingDeps(s).filter(({ d }) => d.status !== "cancelled");
  const seats = ups.reduce((t, x) => t + x.d.seats, 0), filled = ups.reduce((t, x) => t + x.d.booked, 0);
  const onDeposit = live.filter((b) => b.status === "deposit");
  const toCollect = onDeposit.reduce((t, b) => t + balanceDue(s, b).owed, 0);
  const name = (id: string) => s.customers.find((c) => c.id === id)!.name;
  const short = (id: string) => s.tours.find((t) => t.id === id)!.short;

  // At most three plain-English jobs, most urgent first.
  const todo = [
    ...live.filter((b) => b.status === "failed").map((b) => ({ kind: "bad", title: `${name(b.customerId)}'s card was declined`, sub: short(b.tourId), id: b.id, act: "Sort it" })),
    ...onDeposit.filter((b) => daysBetween(TODAY, balanceDue(s, b).date) <= 30).map((b) => ({ kind: "warn", title: `${name(b.customerId)} owes ${money(balanceDue(s, b).owed)}`, sub: `Due in ${daysBetween(TODAY, balanceDue(s, b).date)} days`, id: b.id, act: "View" })),
  ].slice(0, 3);
  const next = ups[0];
  const hour = new Date().getHours();

  return (
    <>
      <div className="ahead">
        <h1>Good {hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}, {s.settings.owner.split(" ")[0]}</h1>
        <p>Here&apos;s how the business is going. These numbers update by themselves.</p>
      </div>

      <div className="kpis">
        <div className="kpi"><span className="l">Money in this month</span><span className="v num">{money(takings(monthKey(TODAY)))}</span><Trend now={takings(monthKey(TODAY))} before={takings("2026-09")} /></div>
        <div className="kpi"><span className="l">New bookings this month</span><span className="v num">{newBookings(monthKey(TODAY))}</span><Trend now={newBookings(monthKey(TODAY))} before={newBookings("2026-09")} /></div>
        <div className="kpi"><span className="l">Seats filled</span><span className="v num">{filled} / {seats}</span><span className="t">{Math.round((filled / Math.max(1, seats)) * 100)}% of upcoming trips</span></div>
        <div className="kpi"><span className="l">Still to collect</span><span className="v num">{money(toCollect)}</span><span className="t">from {onDeposit.length} bookings</span></div>
      </div>

      <section className="acard">
        <h2>Things to do</h2>
        {todo.length ? <div className="todo">{todo.map((x) => (
          <div key={x.id} className="todo-item">
            <span className={`ic ${x.kind}`}><Icon.alert /></span>
            <span><b>{x.title}</b><small>{x.sub}</small></span>
            <button className={`btn ${x.kind === "bad" ? "btn-primary" : "btn-soft"}`} onClick={() => openBooking(x.id)}>{x.act}</button>
          </div>
        ))}</div> : <div className="allgood"><Icon.tick /> Nothing needs you right now. Enjoy the day.</div>}
      </section>

      {next && (
        <section className="acard">
          <h2>Next trip</h2>
          <div className="nexttrip">
            <img src={next.t.cover} alt="" />
            <div className="stack" style={{ gap: 8 }}>
              <b style={{ color: "var(--ink)", fontSize: "1.1rem" }}>{next.t.name}</b>
              <span style={{ color: "var(--ink-3)" }}>{fmtDay(next.d.date)} · in {daysBetween(TODAY, next.d.date)} days</span>
              <div className="meter"><i style={{ width: `${(next.d.booked / next.d.seats) * 100}%` }} /></div>
              <span style={{ fontSize: ".95rem" }}>{next.d.booked} booked · {seatsLeft(next.d)} seats left</span>
            </div>
          </div>
          <div><Link className="btn btn-soft" href="/admin/bookings">See who&apos;s coming <Icon.arrow /></Link></div>
        </section>
      )}
    </>
  );
}
