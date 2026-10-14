"use client";
import { bookPath, useRouteId } from "@/lib/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import Faq from "@/components/site/Faq";
import Carousel from "@/components/site/Carousel";
import TourCard from "@/components/site/TourCard";
import { TODAY, addDays, fmtDay, fmtShort, lowestPrice, money, seatsClass, seatsLeft, seatsText, typeLabel } from "@/lib/utils";

const TABS = [["overview", "Overview"], ["itinerary", "Day by day"], ["included", "What's included"], ["vehicle", "Your vehicle"], ["faq", "FAQ"]] as const;

export default function TourPage() {
  const id = useRouteId();
  const { s } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("overview");
  const [sel, setSel] = useState<string | null>(null);
  const [allDays, setAllDays] = useState(false);
  useEffect(() => { document.body.classList.add("has-mbar"); return () => document.body.classList.remove("has-mbar"); }, []);

  const t = s.tours.find((x) => x.id === id);
  if (!t) return <section className="phead"><div className="wrap"><h1 className="t-1">Tour not found</h1><Link className="btn btn-primary" href="/tours">See all tours</Link></div></section>;

  const deps = t.departures.filter((d) => d.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const cur = deps.find((d) => d.id === sel && seatsLeft(d) > 0) || deps.find((d) => seatsLeft(d) > 0);
  const st = s.settings;
  const book = () => cur && router.push(bookPath(t.id, cur.id));
  const days = allDays ? t.itinerary : t.itinerary.slice(0, 6);
  const related = s.tours.filter((x) => x.published && x.id !== t.id && x.region === t.region).concat(s.tours.filter((x) => x.published && x.id !== t.id && x.region !== t.region)).slice(0, 3);

  return (
    <>
      <section className="phead tall"><img src={t.cover} alt={t.name} /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/tours">Tours</Link><span>/</span><Link href={`/tours?region=${encodeURIComponent(t.region)}`}>{t.region}</Link></div>
        <h1 className="t-hero" style={{ maxWidth: "18ch" }}>{t.name}</h1>
        <p>{t.summary}</p>
        <div className="glass-facts">
          <div><span>Duration</span><b>{t.days} {t.days === 1 ? "day" : "days"}</b></div>
          <div><span>Route</span><b>{t.startEnd}</b></div>
          <div><span>Distance</span><b className="num">{t.distanceKm.toLocaleString()} km</b></div>
          <div><span>Travel</span><b>{t.types.map(typeLabel).join(" or ")}</b></div>
          <div><span>Level</span><b>{t.difficulty}</b></div>
        </div>
      </div></section>

      <section className="sec s-paper light" style={{ paddingTop: "clamp(40px,5vw,72px)" }}><div className="wrap detail">
        <div style={{ minWidth: 0 }}>
          <div className="tabs" role="tablist">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
          <div className="pbody">
            {tab === "overview" && <>
              <div className="prose">{t.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}</div>
              <div className="stack" style={{ gap: 16 }}><h2 className="t-2">Highlights</h2><ul className="ticks two">{t.highlights.map((h) => <li key={h}>{h}</li>)}</ul></div>
              <Carousel size="2" label="Trip photos" head={<h2 className="t-2">Photos</h2>}>
                {t.images.map((g) => <div key={g} className="photo"><img src={g} alt="" loading="lazy" /></div>)}
              </Carousel>
            </>}
            {tab === "itinerary" && <>
              <div className="rdays">{days.map((d) => <div key={d.day} className="rday"><span className="pin">{d.day}</span><h4>{d.title}</h4><p>{d.text}</p></div>)}</div>
              {t.itinerary.length > 6 && <button className="btn btn-line" style={{ justifySelf: "start" }} onClick={() => setAllDays(!allDays)}>{allDays ? "Show fewer days" : `Show all ${t.itinerary.length} days`}</button>}
            </>}
            {tab === "included" && <div className="grid cols-2" style={{ gap: 36 }}>
              <div className="stack" style={{ gap: 16 }}><h2 className="t-2">Included</h2><ul className="ticks">{t.inclusions.map((h) => <li key={h}>{h}</li>)}</ul></div>
              <div className="stack" style={{ gap: 16 }}><h2 className="t-2">Not included</h2><ul className="ticks x">{t.exclusions.map((h) => <li key={h}>{h}</li>)}</ul></div>
            </div>}
            {tab === "vehicle" && <>
              <p className="lede">Tagging along? Your 4WD needs to meet these before departure. Riding onboard? You can skip this bit.</p>
              <ul className="ticks">{t.requirements.map((h) => <li key={h}>{h}</li>)}</ul>
              <div className="note"><Icon.info /><span>We email the Outback Service Check list when you book. Any 4WD workshop can do it in about an hour.</span></div>
            </>}
            {tab === "faq" && <Faq />}
          </div>
        </div>

        <aside className="bcard topo" id="dates">
          <div className="from">from<b className="num">{money(lowestPrice(t))}</b></div>
          <div className="small muted">{[t.price.tag && `Tag along ${money(t.price.tag)}`, t.price.ride && `Ride onboard ${money(t.price.ride)}`].filter(Boolean).join(" · ")} per person</div>
          <div className="stack" style={{ gap: 8 }}>
            <span className="kicker">Choose a date</span>
            {deps.length ? deps.map((d) => { const l = seatsLeft(d); return (
              <button key={d.id} className={`dep ${cur?.id === d.id ? "on" : ""}`} disabled={l === 0} onClick={() => setSel(d.id)}>
                <span><b>{fmtDay(d.date)}</b><small>{d.note || (t.days > 1 ? `Back ${fmtShort(addDays(d.date, t.days - 1))}` : "Day trip")}</small></span>
                <span className={`seats ${seatsClass(l)}`}>{seatsText(l)}</span>
              </button>); }) : <p className="small">New dates coming soon. Message Tony to go on the waitlist.</p>}
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={!cur} onClick={book}>Book with a {st.depositPercent}% deposit <Icon.arrow /></button>
          <div className="trust"><span><Icon.lock />Secure payment through Stripe</span><span><Icon.tick />Balance due {st.balanceDueDays} days before you go</span><span><Icon.tick />Max {st.maxGroup} vehicles per trip</span></div>
          <Link className="link small" href="/contact">Questions? Ask Tony</Link>
        </aside>
      </div></section>

      {related.length > 0 && (
        <section className="sec s-night topo"><div className="wrap">
          <Carousel label="More trips" head={<><span className="kicker">Keep exploring</span><h2 className="t-1">You might also <em>like</em></h2></>}>
            {related.map((x) => <TourCard key={x.id} t={x} />)}
          </Carousel>
        </div></section>
      )}

      <div className="mbar">
        <span className="p">from<b className="num">{money(lowestPrice(t))}</b></span>
        <button className="btn btn-primary" disabled={!cur} onClick={book}>{cur ? `Book ${fmtShort(cur.date)}` : "Sold out"} <Icon.arrow /></button>
      </div>
    </>
  );
}
