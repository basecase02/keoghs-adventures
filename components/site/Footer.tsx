"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";

export default function Footer() {
  const { s } = useStore();
  const { toast } = useUI();
  const st = s.settings;
  return (
    <footer className="site topo">
      <div className="wrap">
        <div className="ftop">
          <div>
            <img className="flogo" src="/img/logo.png" alt="Keogh's Adventures" />
            <p style={{ maxWidth: "34ch" }}>Small-group 4WD tours to the most remote corners of Western Australia, led by Tony Keogh.</p>
            <div className="badges">
              <img src="/img/badge-quality-tourism.png" alt="Quality Tourism Accredited Business" />
              <img src="/img/badge-sustainable.png" alt="Sustainable Tourism" />
              <img src="/img/badge-emissions.png" alt="Tourism Emissions Reduction Commitment" />
            </div>
          </div>
          <nav aria-label="Tours">
            <h4>Tours</h4>
            <ul>
              {s.regions.map((r) => <li key={r.id}><Link href={`/tours?region=${encodeURIComponent(r.id)}`}>{r.id}</Link></li>)}
              <li><Link href="/contact">Private tours</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Tony</Link></li>
              <li><Link href="/news">Trip news</Link></li>
              <li><Link href="/contact">Booking terms</Link></li>
              <li><Link href="/contact">Privacy policy</Link></li>
            </ul>
          </nav>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href={`tel:${st.phone.replace(/\s/g, "")}`}>{st.phone}</a></li>
              <li><a href={`mailto:${st.email}`}>{st.email}</a></li>
              <li>{st.location}</li>
            </ul>
            <p className="small" style={{ marginTop: 18 }}>New dates go to subscribers first.</p>
            <form className="nl" onSubmit={(e) => { e.preventDefault(); toast("You're on the list. New dates land in your inbox first."); e.currentTarget.reset(); }}>
              <label className="sr" htmlFor="nl">Email</label>
              <input id="nl" type="email" placeholder="Your email" required />
              <button className="btn btn-primary btn-sm" type="submit" aria-label="Subscribe"><Icon.arrow /></button>
            </form>
          </div>
        </div>
        <div className="bigword" aria-hidden="true">Keogh&apos;s</div>
        <div className="fbottom">
          <span>© 2026 {st.legalName} · ABN {st.abn}</span>
          <span><a href={st.facebook} target="_blank" rel="noopener">Facebook</a> · <a href={st.instagram} target="_blank" rel="noopener">Instagram</a> · <Link href="/admin">Admin</Link></span>
        </div>
      </div>
    </footer>
  );
}
