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
        <div className="fbar">
          <div className="grp">
            <Link className={`pill ${!type ? "on" : ""}`} href={href({ type: "" })}>Any style</Link>
            <Link className={`pill ${type === "tag" ? "on" : ""}`} href={href({ type: "tag" })}>Tag along</Link>
            <Link className={`pill ${type === "ride" ? "on" : ""}`} href={href({ type: "ride" })}>Ride onboard</Link>
          </div>
          <div className="grp">
            <Link className={`pill ${!region ? "on" : ""}`} href={href({ region: "" })}>All regions</Link>
            {s.regions.map((r) => <Link key={r.id} className={`pill ${region === r.id ? "on" : ""}`} href={href({ region: r.id })}>{r.id}</Link>)}
          </div>
          <select aria-label="Month" value={month} onChange={(e) => router.push(href({ month: e.target.value }))}>
            <option value="">Any month</option>
            {months.map((m) => <option key={m} value={m}>{MONTHS[Number(m.slice(5)) - 1]} {m.slice(0, 4)}</option>)}
          </select>
          <span className="count">{tours.length} {tours.length === 1 ? "trip" : "trips"}</span>
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
