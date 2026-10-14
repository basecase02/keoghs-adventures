"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import { fmtShort, lowestPrice, money, nextDeparture, seatsLeft, uid } from "@/lib/utils";

export default function TripsAdmin() {
  const { s, update } = useStore();
  const { toast } = useUI();
  const router = useRouter();
  const addTour = () => {
    const id = uid("tour-");
    update((st) => { st.tours.push({ id, code: "", name: "New trip", short: "New trip", region: st.regions[0].id, types: ["tag"], days: 3, nights: 2, price: { tag: 990, ride: null }, distanceKm: 300, fuelRangeKm: 200, difficulty: "Easy", startEnd: "Perth → Perth", activities: [], cover: `${BASE}/img/beach-convoy.jpg`, images: [`${BASE}/img/beach-convoy.jpg`], published: false, featured: false, summary: "", description: "", highlights: [], itinerary: [{ day: 1, title: "", text: "" }], inclusions: [], exclusions: [], requirements: [], departures: [] }); });
    router.push(`/admin/tours/${id}`);
  };
  return (
    <>
      <div className="ahead">
        <h1>Trips</h1>
        <p>Flick the switch to show or hide a trip on the website. Tap Edit to change prices, dates or photos.</p>
      </div>
      <div className="trips">
        {s.tours.map((t) => {
          const nd = nextDeparture(t);
          return (
            <article key={t.id} className="trip">
              <img src={t.cover} alt="" loading="lazy" />
              <div className="in">
                <h3>{t.name}</h3>
                <span className="sub">From {money(lowestPrice(t))} · {nd ? `next ${fmtShort(nd.date)}, ${seatsLeft(nd)} seats left` : "no dates yet"}</span>
                <div className="acts">
                  <button className="sw" role="switch" aria-checked={t.published} onClick={() => { update((st) => { const x = st.tours.find((y) => y.id === t.id)!; x.published = !x.published; }); toast(t.published ? "Hidden from the website" : "Now showing on the website"); }}>
                    <span className="toggle" aria-checked={t.published} />{t.published ? "On website" : "Hidden"}
                  </button>
                  <Link className="btn btn-soft" href={`/admin/tours/${t.id}`}>Edit</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <button className="add" onClick={addTour}>+ Add a new trip</button>
    </>
  );
}
