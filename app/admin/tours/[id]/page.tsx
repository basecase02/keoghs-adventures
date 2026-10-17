"use client";
import { tourPath, useRouteId } from "@/lib/routes";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import { SaveBar } from "@/components/admin/AdminShell";
import type { Tour } from "@/lib/types";
import { TODAY, addDays, depositOf, fmtShort, money, uid } from "@/lib/utils";

const LIBRARY = ["canning-convoy", "canning-red-dune", "canning-track", "canning-ranges", "pilbara-ranges-aerial", "mitchell-falls", "bell-gorge", "manning-gorge", "windjana-gorge", "emma-gorge-falls", "kimberley-waterfall", "galvans-gorge-swim", "lake-argyle-sunset-swim", "tunnel-creek-wading", "bungle-bungles-chasm", "wolfe-creek-crater", "kimberley-creek-crossing", "bunda-cliffs", "coastal-track", "beach-convoy", "dunes-group", "patrol-beach-dune", "patrol-sand-tyre", "karri-forest-emu"].map((p) => `${BASE}/img/${p}.jpg`);
const lines = (a: string[]) => a.join("\n");
const unlines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export default function TripEditor() {
  const id = useRouteId();
  const { s, update, ready } = useStore();
  const { toast, confirm } = useUI();
  const router = useRouter();
  const saved = s.tours.find((t) => t.id === id);
  const [d, setD] = useState<Tour | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (ready && saved && !d) setD(clone(saved)); }, [ready, saved, d]);

  if (!saved) return <div className="acard">That trip doesn&apos;t exist any more. <Link className="link" href="/admin/tours">Back to trips</Link></div>;
  if (!d) return null;

  const set = (p: Partial<Tour>) => { setD({ ...d, ...p }); setDirty(true); };
  const save = () => {
    const types = (["tag", "ride"] as const).filter((k) => d.price[k]);
    if (!d.name.trim()) return toast("Please give the trip a name.", "bad");
    if (!types.length) return toast("Please add at least one price.", "bad");
    const prices = [d.price.tag, d.price.ride].filter((x): x is number => x != null);
    if (prices.some((x) => !Number.isFinite(x) || x < 0 || x > 100000)) return toast("Prices must be between $0 and $100,000.", "bad");
    if (!Number.isFinite(d.days) || d.days < 1 || d.days > 365) return toast("Number of days must be between 1 and 365.", "bad");
    if (d.departures.some((x) => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.seats < x.booked || x.seats > 500)) return toast("Check the dates and seat numbers: seats can't be fewer than already booked.", "bad");
    const next = { ...d, short: d.short || d.name, types: [...types], nights: Math.max(0, d.days - 1), itinerary: [...d.itinerary].sort((a, b) => a.day - b.day) };
    update((st) => { st.tours = st.tours.map((t) => (t.id === id ? next : t)); });
    setD(next); setDirty(false); toast("Saved. It's live on the website.");
  };
  const remove = async () => {
    if (s.bookings.some((b) => b.tourId === id)) return toast("This trip has bookings, so hide it instead of deleting.", "bad");
    if (!(await confirm({ title: `Delete ${d.name}?`, text: "The trip and its dates are removed for good.", ok: "Delete trip", danger: true }))) return;
    update((st) => { st.tours = st.tours.filter((t) => t.id !== id); }); router.push("/admin/tours");
  };
  const price = (k: "tag" | "ride", v: string) => set({ price: { ...d.price, [k]: v === "" ? null : Number(v) } });

  return (
    <>
      <div className="ahead">
        <Link className="link small" href="/admin/tours" style={{ justifySelf: "start" }}>← All trips</Link>
        <h1>{d.name || "New trip"}</h1>
        <p>Open a section, make your change, then press Save. <Link className="link" href={tourPath(id)} target="_blank" rel="noopener noreferrer">See it on the website</Link></p>
      </div>

      <div className="acard" style={{ gridTemplateColumns: "1fr auto", alignItems: "center" }}>
        <span><b style={{ color: "var(--ink)" }}>Show this trip on the website</b><br /><small style={{ color: "var(--ink-3)" }}>Turn off to hide it without deleting anything.</small></span>
        <button className="toggle" role="switch" aria-checked={d.published} aria-label="Show on website" onClick={() => set({ published: !d.published })} />
      </div>

      <details className="acc" open>
        <summary><span><b>Name and price</b><small>What guests see first</small></span></summary>
        <div className="body form">
          <div className="field full"><label htmlFor="tn">Trip name</label><input id="tn" type="text" value={d.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="field"><label htmlFor="tpt">Tag along price (each person)</label><input id="tpt" type="number" inputMode="numeric" value={d.price.tag ?? ""} onChange={(e) => price("tag", e.target.value)} placeholder="Leave empty if not offered" /><span className="hint">{d.price.tag ? `Deposit: ${money(depositOf(s, d.price.tag), 2)}` : "Not offered"}</span></div>
          <div className="field"><label htmlFor="tpr">Ride onboard price (each person)</label><input id="tpr" type="number" inputMode="numeric" value={d.price.ride ?? ""} onChange={(e) => price("ride", e.target.value)} placeholder="Leave empty if not offered" /><span className="hint">{d.price.ride ? `Deposit: ${money(depositOf(s, d.price.ride), 2)}` : "Not offered"}</span></div>
          <div className="field"><label htmlFor="td">Number of days</label><input id="td" type="number" inputMode="numeric" min="1" value={d.days} onChange={(e) => set({ days: Number(e.target.value) || 1 })} /></div>
          <div className="field"><label htmlFor="tr">Region</label><select id="tr" value={d.region} onChange={(e) => set({ region: e.target.value })}>{s.regions.map((r) => <option key={r.id}>{r.id}</option>)}</select></div>
          <div className="field full"><label htmlFor="tsum">One-line description</label><textarea id="tsum" style={{ minHeight: 80 }} value={d.summary} onChange={(e) => set({ summary: e.target.value })} /></div>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Dates and seats</b><small>{d.departures.length} {d.departures.length === 1 ? "date" : "dates"}</small></span></summary>
        <div className="body">
          {[...d.departures].sort((a, b) => a.date.localeCompare(b.date)).map((dep) => {
            const ch = (p: Partial<typeof dep>) => set({ departures: d.departures.map((x) => (x.id === dep.id ? { ...x, ...p } : x)) });
            return (
              <div key={dep.id} className="itemrow">
                <div className="rowtop"><b>{fmtShort(dep.date)} · {dep.booked} booked</b>{dep.booked === 0 && <button className="rm" onClick={() => set({ departures: d.departures.filter((x) => x.id !== dep.id) })}>Remove</button>}</div>
                <div className="form">
                  <div className="field"><label>Leaves on</label><input type="date" value={dep.date} onChange={(e) => ch({ date: e.target.value })} /></div>
                  <div className="field"><label>Total seats</label><input type="number" inputMode="numeric" min={dep.booked} value={dep.seats} onChange={(e) => ch({ seats: Math.max(dep.booked, Number(e.target.value) || 0) })} /></div>
                  <label className="check full"><input type="checkbox" checked={dep.status === "full"} onChange={(e) => ch({ status: e.target.checked ? "full" : "open" })} /> Stop taking bookings for this date (waitlist only)</label>
                </div>
              </div>
            );
          })}
          <button className="add" onClick={() => set({ departures: [...d.departures, { id: uid("d-"), date: addDays(TODAY, 120), seats: s.settings.maxGroup, booked: 0, status: "open", note: "" }] })}>+ Add a date</button>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Day by day</b><small>{d.itinerary.length} days written</small></span></summary>
        <div className="body">
          {d.itinerary.map((it, i) => {
            const ch = (p: Partial<typeof it>) => set({ itinerary: d.itinerary.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <div key={i} className="itemrow">
                <div className="rowtop"><b>Day {it.day}</b><button className="rm" onClick={() => set({ itinerary: d.itinerary.filter((_, j) => j !== i) })}>Remove</button></div>
                <input type="text" value={it.title} placeholder="Where you'll be, e.g. Bell Gorge" onChange={(e) => ch({ title: e.target.value })} aria-label={`Day ${it.day} place`} />
                <textarea style={{ minHeight: 80 }} value={it.text} placeholder="What happens that day" onChange={(e) => ch({ text: e.target.value })} aria-label={`Day ${it.day} description`} />
              </div>
            );
          })}
          <button className="add" onClick={() => set({ itinerary: [...d.itinerary, { day: (d.itinerary.at(-1)?.day || 0) + 1, title: "", text: "" }] })}>+ Add a day</button>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>What&apos;s included</b><small>One thing per line</small></span></summary>
        <div className="body">
          <div className="field"><label htmlFor="ti">Included</label><textarea id="ti" style={{ minHeight: 180 }} value={lines(d.inclusions)} onChange={(e) => set({ inclusions: unlines(e.target.value) })} /></div>
          <div className="field"><label htmlFor="tx">Not included</label><textarea id="tx" style={{ minHeight: 140 }} value={lines(d.exclusions)} onChange={(e) => set({ exclusions: unlines(e.target.value) })} /></div>
          <div className="field"><label htmlFor="th">Highlights</label><textarea id="th" style={{ minHeight: 140 }} value={lines(d.highlights)} onChange={(e) => set({ highlights: unlines(e.target.value) })} /></div>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Photos</b><small>{d.images.length} chosen</small></span></summary>
        <div className="body">
          <p style={{ color: "var(--ink-3)" }}>Tap a photo to add it. Tap a ticked photo to make it the main photo. Tap the main photo to remove it.</p>
          <div className="photos">{LIBRARY.map((src) => {
            const on = d.images.includes(src); const main = d.cover === src;
            return (
              <button key={src} className={`${on ? "on" : "off"} ${main ? "main" : ""}`} aria-pressed={on} onClick={() => {
                if (!on) set({ images: [...d.images, src] });
                else if (!main) set({ cover: src });
                else if (d.images.length > 1) { const rest = d.images.filter((x) => x !== src); set({ images: rest, cover: rest[0] }); }
              }}><img src={src} alt="" loading="lazy" /></button>
            );
          })}</div>
          <p className="small" style={{ color: "var(--ink-3)" }}>In the finished site you can also upload photos straight from your phone.</p>
        </div>
      </details>

      <button className="rm" style={{ justifySelf: "start" }} onClick={remove}>Delete this trip</button>
      {dirty && <SaveBar onSave={save} onDiscard={() => { setD(clone(saved)); setDirty(false); }} />}
    </>
  );
}
