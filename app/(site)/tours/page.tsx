"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import TourCard from "@/components/site/TourCard";
import { MONTHS, TODAY } from "@/lib/utils";

function ToursInner() {
  const { s } = useStore();
  const q = useSearchParams();
  const router = useRouter();
  const type = q.get("type") || ""; const region = q.get("region") || ""; const month = q.get("month") || "";
  const all = s.tours.filter((t) => t.published);
  const months = useMemo(() => Array.from(new Set(all.flatMap((t) => t.departures.filter((d) => d.date >= TODAY).map((d) => d.date.slice(0, 7))))).sort(), [all]);
  let tours = all;
  if (type === "ride" || type === "tag") tours = tours.filter((t) => t.types.includes(type));
  if (region) tours = tours.filter((t) => t.region === region);
  if (month) tours = tours.filter((t) => t.departures.some((d) => d.date.startsWith(month)));

  const href = (p: Record<string, string>) => { const n = new URLSearchParams({ type, region, month, ...p }); [...n.keys()].forEach((k) => !n.get(k) && n.delete(k)); return `/tours${n.size ? "?" + n : ""}`; };
  const head = s.regions.find((r) => r.id === region);
  const title = region ? <>{region}</> : type === "ride" ? <>Ride <em>onboard</em></> : type === "tag" ? <>Tag <em>along</em></> : <>Every tour, every <em>date</em></>;

  return (
    <>
      <section className="phead"><img src={head?.img || `${BASE}/img/canning-ranges.jpg`} alt="" /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><span>Tours</span></div>
        <h1 className="t-hero">{title}</h1>
        <p>{head ? head.blurb : "Live prices and seat counts for every departure. Pick a trip to see the full itinerary."}</p>
      </div></section>
      <section className="sec s-night topo" style={{ paddingTop: "clamp(36px,5vw,60px)" }}><div className="wrap">
        <div className="tfilter">
          <div className="rtiles" role="radiogroup" aria-label="Region">
            <Link role="radio" aria-checked={!region} className={`rtile ${!region ? "on" : ""}`} href={href({ region: "" })}>
              <img src={`${BASE}/img/canning-ranges.jpg`} alt="" /><span><b>All of WA</b><small>{all.length} trips</small></span>
            </Link>
            {s.regions.map((r) => (
              <Link key={r.id} role="radio" aria-checked={region === r.id} className={`rtile ${region === r.id ? "on" : ""}`} href={href({ region: r.id })}>
                <img src={r.img} alt="" loading="lazy" /><span><b>{r.id}</b><small>{(() => { const n = all.filter((t) => t.region === r.id).length; return `${n} ${n === 1 ? "trip" : "trips"}`; })()}</small></span>
              </Link>
            ))}
          </div>
          <div className="trow2">
            <div className="seg3" role="radiogroup" aria-label="How you travel">
              {([["", "Any style"], ["tag", "Tag along"], ["ride", "Ride onboard"]] as const).map(([k, l]) => (
                <Link key={l} role="radio" aria-checked={type === k} className={type === k ? "on" : ""} href={href({ type: k })}>{l}</Link>
              ))}
            </div>
            <label className="msel"><span>When</span>
              <select aria-label="Month" value={month} onChange={(e) => router.push(href({ month: e.target.value }))}>
                <option value="">Any month</option>
                {months.map((m) => <option key={m} value={m}>{MONTHS[Number(m.slice(5)) - 1]} {m.slice(0, 4)}</option>)}
              </select>
            </label>
            <span className="tcount"><b>{tours.length}</b> {tours.length === 1 ? "trip" : "trips"}{(type || region || month) && <> · <Link href="/tours">Clear filters</Link></>}</span>
          </div>
        </div>
        {tours.length ? <div className="grid cols-3">{tours.map((t) => <TourCard key={t.id} t={t} />)}</div>
          : <div className="stack" style={{ justifyItems: "start" }}><p className="lede">No trips match those filters yet.</p><Link className="btn btn-primary" href="/tours">Show all tours</Link></div>}
      </div></section>
    </>
  );
}

export default function ToursPage() {
  return <Suspense><ToursInner /></Suspense>;
}
