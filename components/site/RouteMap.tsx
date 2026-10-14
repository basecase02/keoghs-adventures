"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";

/*
 * Simplified Western Australia, projected from real coordinates
 * (x = (lon − 112.5) × 23.5, y = (−lat − 13.5) × 22.7). Routes run between
 * the real start and finish towns of each tour region.
 */
const WA = "M387.8 31.8 L369 40.9 L350.1 9.1 L317.3 9.1 L289 40.9 L260.9 61.3 L244.4 74.9 L228 99.9 L204.5 131.7 L152.8 152.1 L101 161.2 L49.4 188.5 L35.3 204.3 L25.9 238.4 L16.5 283.8 L37.6 322.4 L49.4 347.4 L58.8 386 L75.2 417.8 L72.9 451.8 L58.8 456.4 L61.1 474.5 L96.4 488.2 L126.9 490.4 L173.9 467.7 L220.9 463.2 L260.9 463.2 L293.8 433.7 L340.8 426.9 L387.8 413.3 Z";

const ROUTES: Record<string, { d: string; pins: [number, number, string][] }> = {
  "Canning Stock Route": { d: "M181 297 C 200 260, 215 240, 238 228 S 270 200, 282 180 S 300 150, 318 135 S 345 118, 357 107", pins: [[181, 297, "Wiluna"], [357, 107, "Halls Creek"]] },
  "Gibb River Road & Kimberley": { d: "M228 100 C 240 90, 250 70, 268 66 S 300 58, 318 52 S 355 46, 381 52 M381 52 C 378 70, 370 90, 357 107", pins: [[228, 100, "Broome"], [381, 52, "Kununurra"]] },
  "Eyre to Esperance": { d: "M324 426 C 300 440, 275 450, 260 455 S 235 462, 221 463", pins: [[324, 426, "Eyre"], [221, 463, "Esperance"]] },
  "Southwest Coastal": { d: "M75 418 C 78 440, 80 455, 82 474", pins: [[82, 474, "Pemberton"]] },
};

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

export default function RouteMap() {
  const { s } = useStore();
  const [sel, setSel] = useState(s.regions[0]?.id);
  const region = s.regions.find((r) => r.id === sel);
  const count = (id: string) => s.tours.filter((t) => t.published && t.region === id).length;

  return (
    <div className="mapwrap">
      <div className="stack" style={{ gap: 18 }}>
        <span className="kicker">The routes</span>
        <h2 className="t-1">{WORDS[s.regions.length] || s.regions.length} routes. One <em>very</em> big state.</h2>
        <p className="lede">Western Australia is bigger than Western Europe. These are the corners of it Tony knows best, from the red dunes of the Canning to the white sand of Esperance.</p>
        <div className="rlist" role="tablist" aria-label="Regions">
          {s.regions.map((r) => (
            <button key={r.id} role="tab" aria-selected={sel === r.id} className={`rbtn ${sel === r.id ? "on" : ""}`} onClick={() => setSel(r.id)} onMouseEnter={() => setSel(r.id)}>
              <img src={r.img} alt="" loading="lazy" />
              <span><b>{r.id}</b><small>{r.blurb}</small></span>
              <span className="n">{count(r.id)} {count(r.id) === 1 ? "trip" : "trips"}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="map">
        <svg viewBox="0 -20 420 530" role="img" aria-label="Map of Western Australia showing Keogh's Adventures tour routes">
          <defs>
            <pattern id="dotgrid" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="rgba(90,32,11,.16)" /></pattern>
          </defs>
          <path className="land" d={WA} />
          <path d={WA} fill="url(#dotgrid)" />
          {Object.entries(ROUTES).map(([id, r]) => <path key={id} className={`route ${sel === id ? "on" : ""}`} d={r.d} />)}
          {Object.entries(ROUTES).flatMap(([id, r]) => r.pins.map(([x, y, label]) => (
            <g key={id + label} onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
              <circle className={`ring ${sel === id ? "on" : ""}`} cx={x} cy={y} r="6" />
              <circle className={`pin ${sel === id ? "on" : ""}`} cx={x} cy={y} r="5.5" />
              <text x={x + 9} y={y + 4}>{label}</text>
            </g>
          )))}
          <rect className="home" x="70" y="413" width="10" height="10" rx="2" />
          <text x="40" y="408">PERTH · BASE</text>
        </svg>
        {region && (
          <Link key={region.id} className="map-card" href={`/tours?region=${encodeURIComponent(region.id)}`}>
            <img src={region.img} alt="" />
            <div><b>{region.id}</b><span>See {count(region.id)} {count(region.id) === 1 ? "trip" : "trips"} <Icon.arrow /></span></div>
          </Link>
        )}
      </div>
    </div>
  );
}
