"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import TourCard from "@/components/site/TourCard";
import Carousel from "@/components/site/Carousel";
import RouteMap from "@/components/site/RouteMap";
import Faq from "@/components/site/Faq";
import { MONTHS, TODAY, parseD } from "@/lib/utils";

const SLIDES = [
  { src: `${BASE}/img/canning-convoy.jpg`, cap: "Canning Stock Route" },
  { src: `${BASE}/img/mitchell-falls.jpg`, cap: "Mitchell Falls, Kimberley" },
  { src: `${BASE}/img/patrol-beach-dune.jpg`, cap: "Yeagarup Dunes, Southwest" },
  { src: `${BASE}/img/pilbara-ranges-aerial.jpg`, cap: "First light over the ranges" },
];
const NAMES = ["Canning Stock Route", "Mitchell Falls", "Gibb River Road", "Bungle Bungles", "Wolfe Creek", "Cape Arid", "Lake Argyle", "Durba Springs"];
const DAY = [
  { time: "5:45am", img: "pilbara-ranges-aerial", h: "Billy tea at first light", p: "The ranges turn pink, the billy boils, and nobody has looked at a phone in days." },
  { time: "8:30am", img: "canning-convoy", h: "The convoy rolls out", p: "Tony calls every crest on the UHF. You'll be reading the sand like a local by day three." },
  { time: "11:00am", img: "galvans-gorge-swim", h: "A gorge to yourselves", p: "Swim stops at waterholes most travellers never reach." },
  { time: "2:00pm", img: "canning-red-dune", h: "Dune country", p: "Tyres down, momentum up. The red dunes are the reason you came." },
  { time: "5:30pm", img: "lake-argyle-sunset-swim", h: "Sundowners", p: "Camp is set, the light goes gold, and someone always gets back in the water." },
  { time: "8:00pm", img: "cable-beach-sunset", h: "Campfire and a billion stars", p: "Dinner on the fire, stories round it, and a sky with no light for 500 km." },
];
const COLLAGE = ["bell-gorge", "tunnel-creek-wading", "rock-art-cave", "bungle-bungles-chasm", "dunes-group", "lake-argyle-sunset-swim", "wolfe-creek-crater"];

export default function Home() {
  const { s } = useStore();
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [rev, setRev] = useState(0);
  const [f, setF] = useState({ region: "", type: "", month: "" });
  useEffect(() => { const t = setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 6500); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setRev((i) => (i + 1) % Math.max(1, s.reviews.length)), 8000); return () => clearInterval(t); }, [s.reviews.length]);

  const tours = s.tours.filter((t) => t.published);
  const ordered = [...tours.filter((t) => t.featured), ...tours.filter((t) => !t.featured)];
  const months = useMemo(() => Array.from(new Set(tours.flatMap((t) => t.departures.filter((d) => d.date >= TODAY).map((d) => d.date.slice(0, 7))))).sort(), [tours]);
  const fromPrice = (k: "tag" | "ride") => Math.min(...tours.map((t) => t.price[k] || Infinity));
  const r = s.reviews[rev % Math.max(1, s.reviews.length)];

  const find = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
    router.push(`/tours${q.size ? "?" + q : ""}`);
  };

  return (
    <>
      <section className="hero" aria-label="Welcome">
        <div className="hero-img">{SLIDES.map((x, i) => <img key={x.src} src={x.src} alt={i === 0 ? "A Keogh's Adventures convoy on the red sand of the Canning Stock Route" : ""} className={i === slide ? "on" : ""} fetchPriority={i === 0 ? "high" : "low"} />)}</div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="kicker" style={{ color: "var(--ochre)" }}>Small-group 4WD tours · Western Australia</span>
            <h1 className="t-hero" dangerouslySetInnerHTML={{ __html: s.settings.heroTitle }} />
            <p>{s.settings.heroSub}</p>
          </div>
          <form className="finder" onSubmit={find} aria-label="Find a trip">
            <div className="ff"><label htmlFor="f-r">Where</label><select id="f-r" value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })}><option value="">Anywhere in WA</option>{s.regions.map((x) => <option key={x.id} value={x.id}>{x.id}</option>)}</select></div>
            <div className="ff"><label htmlFor="f-t">How</label><select id="f-t" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="">Either way</option><option value="tag">Drive my own 4WD</option><option value="ride">Ride with Tony</option></select></div>
            <div className="ff"><label htmlFor="f-m">When</label><select id="f-m" value={f.month} onChange={(e) => setF({ ...f, month: e.target.value })}><option value="">Any month</option>{months.map((m) => <option key={m} value={m}>{MONTHS[Number(m.slice(5)) - 1]} {m.slice(0, 4)}</option>)}</select></div>
            <button className="btn btn-primary btn-lg" type="submit">Find trips <Icon.arrow /></button>
          </form>
          <div className="hero-foot">
            <div className="slides-ctl">
              <div className="bars">{SLIDES.map((_, i) => <button key={i} className={i === slide ? "on" : ""} aria-label={`Show photo ${i + 1}`} onClick={() => setSlide(i)} />)}</div>
              <span>{SLIDES[slide].cap}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="names" aria-hidden="true">
        <div className="names-track">{[0, 1].map((k) => NAMES.map((n, i) => <span key={`${k}${i}`} style={{ display: "contents" }}><span className={i % 2 ? "" : "f"}>{n}</span><em>✦</em></span>))}</div>
      </div>

      <section className="sec s-night topo" id="ways">
        <div className="wrap">
          <div className="head"><div><span className="kicker">Two ways to come along</span><h2 className="t-1">Drive it yourself, or <em>ride</em> with Tony.</h2></div><p className="lede">Same tracks, same camps, same campfire. The only question is who&apos;s behind the wheel.</p></div>
          <div className="ways">
            <Link className="way" href="/tours?type=tag">
              <img src={`${BASE}/img/kimberley-creek-crossing.jpg`} alt="Tag-along convoy crossing a Kimberley creek" loading="lazy" />
              <div className="in">
                <span className="from">from ${isFinite(fromPrice("tag")) ? fromPrice("tag").toLocaleString() : "—"}</span>
                <h3>Tag along</h3>
                <ul><li>Drive your own prepared 4WD in a small convoy</li><li>Tony leads and calls every dune on the radio</li><li>Permits, camps and recovery backup sorted</li></ul>
                <span className="btn btn-ghost btn-sm">Tag-along trips <Icon.arrow /></span>
              </div>
            </Link>
            <Link className="way" href="/tours?type=ride">
              <img src={`${BASE}/img/patrol-sand-tyre.jpg`} alt="The Keogh's Adventures Patrol on the sand" loading="lazy" />
              <div className="in">
                <span className="from">from ${isFinite(fromPrice("ride")) ? fromPrice("ride").toLocaleString() : "—"}</span>
                <h3>Ride onboard</h3>
                <ul><li>A seat in the Keogh&apos;s Adventures Patrol</li><li>Meals, swag, bedding and transfers included</li><li>No 4WD and no experience needed</li></ul>
                <span className="btn btn-primary btn-sm">Ride-onboard trips <Icon.arrow /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec s-night2 topo">
        <div className="wrap">
          <Carousel label="Upcoming trips" head={<><span className="kicker">2026 – 27 season</span><h2 className="t-1">This season&apos;s <em>departures</em></h2></>}>
            {ordered.map((t) => <TourCard key={t.id} t={t} />)}
          </Carousel>
          <div style={{ marginTop: 34 }}><Link className="link" href="/tours">Every tour and date <Icon.arrow /></Link></div>
        </div>
      </section>

      <section className="sec s-sand light topo"><div className="wrap"><RouteMap /></div></section>

      <section className="sec s-earth stars">
        <div className="wrap">
          <Carousel size="3" label="A day on tour" head={<><span className="kicker">A day out there</span><h2 className="t-1">From billy tea to a <em>billion</em> stars.</h2></>}>
            {DAY.map((m) => (
              <article key={m.time} className="moment">
                <div className="ph"><img src={`${BASE}/img/${m.img}.jpg`} alt="" loading="lazy" /></div>
                <span className="time">{m.time}</span>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
              </article>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="sec s-paper light">
        <div className="wrap tony">
          <div className="ph rv">
            <img src={`${BASE}/img/tony-keogh.jpg`} alt="Tony Keogh at a Kimberley lookout" loading="lazy" />
            <div className="badge"><b>Every trip</b><small>Tony drives the lead car</small></div>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <span className="kicker">Your guide</span>
            <p className="quote">You&apos;ve never had an adventure till you&apos;ve had a Keogh adventure.</p>
            <p className="lede">Speedway, BMX, mountain bikes, road racing, enduro: Tony has raced most things with wheels. These days the challenge is getting a convoy of first-timers across 900 dunes with everyone still grinning at the end.</p>
            <span className="sign">Tony Keogh</span>
            <div className="facts"><div><b>Max {s.settings.maxGroup}</b><span>vehicles per trip</span></div><div><b>Starlink</b><span>every evening</span></div><div><b>QTAB</b><span>accredited</span></div></div>
            <div><Link className="btn btn-dark" href="/about">Tony&apos;s story <Icon.arrow /></Link></div>
          </div>
        </div>
      </section>

      {r && (
        <section className="sec s-night stars">
          <div className="wrap rev">
            <span className="kicker">Round the campfire</span>
            <div className="stars-row" aria-label={`${r.stars} out of 5 stars`}>{"★".repeat(r.stars)}</div>
            <blockquote key={r.id}>&ldquo;{r.text}&rdquo;</blockquote>
            <div className="by"><b>{r.name}</b> · {r.trip}</div>
            <div className="dots">{s.reviews.map((x, i) => <button key={x.id} className={i === rev ? "on" : ""} aria-label={`Review ${i + 1}`} onClick={() => setRev(i)} />)}</div>
            <p className="small muted">Example reviews. The live site will show Tony&apos;s Google reviews.</p>
          </div>
        </section>
      )}

      <section className="sec s-night2" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head" style={{ paddingTop: "clamp(56px,7vw,96px)" }}><div><span className="kicker">From the track</span><h2 className="t-1">Postcards from <em>out there</em></h2></div><a className="link" href={s.settings.instagram} target="_blank" rel="noopener">Follow on Instagram <Icon.arrow /></a></div>
          <div className="collage">{COLLAGE.map((p) => <div key={p}><img src={`${BASE}/img/${p}.jpg`} alt="" loading="lazy" /></div>)}</div>
        </div>
      </section>

      <section className="sec s-paper light">
        <div className="wrap faq-wrap">
          <div className="stack" style={{ alignContent: "start", gap: 18 }}>
            <span className="kicker">Good to know</span>
            <h2 className="t-1">Questions before you <em>go</em>.</h2>
            <p className="lede">Still wondering about something? Tony is always happy to talk it through.</p>
            <div><Link className="btn btn-dark" href="/contact">Ask Tony <Icon.arrow /></Link></div>
          </div>
          <Faq />
        </div>
      </section>

      <section className="finale stars">
        <img src={`${BASE}/img/canning-ranges.jpg`} alt="" loading="lazy" />
        <div className="in">
          <span className="kicker">{tours.reduce((n, t) => n + t.departures.filter((d) => d.date >= TODAY && d.seats > d.booked).length, 0)} departures open</span>
          <h2 className="t-hero">Your seat in the <em>convoy</em> is waiting.</h2>
          <p>Book with a {s.settings.depositPercent}% deposit, or bring your own crew for a private trip. Next dates from {(() => { const d = tours.flatMap((t) => t.departures).filter((d) => d.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]; return d ? `${MONTHS[parseD(d.date).getMonth()]} ${parseD(d.date).getFullYear()}` : "soon"; })()}.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href="/tours">Find your trip <Icon.arrow /></Link>
            <Link className="btn btn-ghost btn-lg" href="/contact">Plan a private trip</Link>
          </div>
        </div>
      </section>
    </>
  );
}
