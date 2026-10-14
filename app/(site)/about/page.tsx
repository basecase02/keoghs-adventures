import { BASE } from "@/lib/base";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "About Tony Keogh",
  description: "Meet Tony Keogh, owner and lead guide of Keogh's Adventures. A lifetime of racing and exploring, now leading small-group 4WD tours across Western Australia.",
  alternates: { canonical: "/about" },
};

const SPEC = [["1,400 km", "fuel range"], ["3", "guest seats"], ["95 L", "fridge on board"], ["Starlink", "every evening"]];
const ACCRED = [
  [`${BASE}/img/badge-quality-tourism.png`, "Quality Tourism Accredited", "Accredited through the Australian Tourism Industry Council."],
  [`${BASE}/img/badge-sustainable.png`, "Sustainable Tourism", "Leave-no-trace camping and real support for remote stores and stations."],
  [`${BASE}/img/badge-emissions.png`, "Emissions reduction", "Part of the Tourism Emissions Reduction program with Carbon Halo."],
];

export default function AboutPage() {
  return (
    <>
      <section className="phead-split">
        <img className="blur" src={`${BASE}/img/tony-group-lookout.jpg`} alt="" />
        <div className="wrap">
          <div className="copy">
            <div className="crumbs"><Link href="/">Home</Link><span>/</span><span>About</span></div>
            <h1 className="t-hero">Always smiling. <em>Always</em> moving.</h1>
            <p>The man in the lead car, and why he does it.</p>
          </div>
          <div className="frame"><img src={`${BASE}/img/tony-group-lookout.jpg`} alt="Tony Keogh with guests at a lookout" /></div>
        </div>
      </section>

      <section className="sec s-paper light"><div className="wrap tony" style={{ alignItems: "start" }}>
        <div className="ph"><img src={`${BASE}/img/tony-keogh.jpg`} alt="Tony Keogh" /><div className="badge"><b>Tony Keogh</b><small>Owner · lead guide</small></div></div>
        <div className="prose">
          <span className="kicker">Tony&apos;s story</span>
          <h2 className="t-1">Built on <em>challenges</em>.</h2>
          <p>Tony Keogh is the owner and lead guide of Keogh&apos;s Adventures. He has raced speedway, BMX, mountain bikes, motorcycles and enduro, and has always gone looking for the next challenge.</p>
          <p>A love of the outdoors turned into a passion for exploring Australia, especially the places that are hard to get to. Sharing them is the whole point of the business.</p>
          <p>Trips run from coastal weekends to fully off-grid outback expeditions: camping under the stars, campfire dinners and meals cooked a thousand kilometres from the nearest shop. Tony drives the lead vehicle on every single departure.</p>
          <span className="sign">You&apos;ve never had an adventure till you&apos;ve had a Keogh adventure.</span>
        </div>
      </div></section>

      <section className="sec s-night topo"><div className="wrap">
        <div className="head"><div><span className="kicker">The rig</span><h2 className="t-1">The Keogh&apos;s <em>Patrol</em></h2></div><p className="lede">Built for ride-onboard guests and for leading convoys through the hardest country in the state.</p></div>
        <div className="grid cols-2" style={{ alignItems: "center", gap: 28 }}>
          <img src={`${BASE}/img/patrol-beach-dune.jpg`} alt="The Keogh's Adventures Patrol on a coastal dune" style={{ borderRadius: 22, aspectRatio: "4/3", objectFit: "cover", width: "100%" }} loading="lazy" />
          <div className="spec" style={{ gridTemplateColumns: "1fr 1fr" }}>{SPEC.map(([b, s]) => <div key={s}><b>{b}</b><span>{s}</span></div>)}</div>
        </div>
      </div></section>

      <section className="sec s-sand light"><div className="wrap">
        <div className="head"><div><span className="kicker">Peace of mind</span><h2 className="t-1">Accredited and <em>insured</em></h2></div></div>
        <div className="accred">{ACCRED.map(([i, h, p]) => <div key={h}><img src={i} alt="" /><h3 className="t-3">{h}</h3><p>{p}</p></div>)}</div>
      </div></section>

      <section className="finale stars">
        <img src={`${BASE}/img/canning-convoy.jpg`} alt="" loading="lazy" />
        <div className="in"><h2 className="t-hero">Ready to come <em>along</em>?</h2><Link className="btn btn-primary btn-lg" href="/tours">See tours and dates <Icon.arrow /></Link></div>
      </section>
    </>
  );
}
