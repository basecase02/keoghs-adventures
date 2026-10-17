"use client";
import { safeInlineHtml, safeMailto, safeTel } from "@/lib/safeHtml";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";

export default function Header() {
  const { s } = useStore();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOff, setMegaOff] = useState(false);
  const solid = path.startsWith("/book");

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const tours = s.tours.filter((t) => t.published);
  const minPrice = (k: "tag" | "ride") => Math.min(...tours.map((t) => t.price[k] || Infinity));
  const st = s.settings;

  return (
    <>
      <header className={`hdr ${scrolled ? "scrolled" : ""} ${solid ? "solid" : ""}`}>
        {st.announcementOn && st.announcement && <Link className="strip" href="/tours" dangerouslySetInnerHTML={{ __html: safeInlineHtml(st.announcement) }} />}
        <div className="wrap bar">
          <Link className="logo-link" href="/" aria-label="Keogh's Adventures home"><img src={`${BASE}/img/logo.png`} alt="Keogh's Adventures" width={120} height={44} /></Link>
          <nav aria-label="Main">
            <ul className="menu">
              <li className={`has-mega ${megaOff ? "off" : ""}`} onMouseLeave={() => setMegaOff(false)} onClick={(e) => { if ((e.target as HTMLElement).closest("a")) { setMegaOff(true); (document.activeElement as HTMLElement)?.blur(); } }}>
                <Link href="/tours" className={`mtrig ${path.startsWith("/tours") ? "active" : ""}`}>Tours <Icon.chev /></Link>
                <div className="mega">
                  {s.regions.map((r) => (
                    <Link key={r.id} className="mega-card" href={`/tours?region=${encodeURIComponent(r.id)}`}>
                      <img src={r.img} alt="" loading="lazy" />
                      <span><b>{r.id}</b><small>{tours.filter((t) => t.region === r.id).length} trips</small></span>
                    </Link>
                  ))}
                  <div className="mega-side">
                    <div>
                      <Link href="/tours?type=tag">Tag along<small>Your 4WD, from {isFinite(minPrice("tag")) ? `$${minPrice("tag").toLocaleString()}` : "—"}</small></Link>
                      <Link href="/tours?type=ride">Ride onboard<small>Our Patrol, from {isFinite(minPrice("ride")) ? `$${minPrice("ride").toLocaleString()}` : "—"}</small></Link>
                      <Link href="/contact">Private tours<small>Your crew, your dates</small></Link>
                    </div>
                    <Link className="btn btn-primary btn-sm" href="/tours" style={{ color: "#1a0b02" }}>All tours <Icon.arrow /></Link>
                  </div>
                </div>
              </li>
              <li><Link href="/about" className={path.startsWith("/about") ? "active" : ""}>About Tony</Link></li>
              <li><Link href="/news" className={path.startsWith("/news") ? "active" : ""}>Trip news</Link></li>
              <li><Link href="/contact" className={path.startsWith("/contact") ? "active" : ""}>Contact</Link></li>
            </ul>
          </nav>
          <div className="hdr-right">
            <a className="call" href={safeTel(st.phone)}><Icon.phone />{st.phone}</a>
            <Link className="btn btn-primary" href="/tours">Book a trip</Link>
            <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><i><span /><span /></i></button>
          </div>
        </div>
      </header>

      <div className={`mnav ${open ? "open" : ""}`} aria-hidden={!open} role="dialog" aria-label="Menu" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
        <img src={`${BASE}/img/canning-red-dune.jpg`} alt="" loading="lazy" decoding="async" />
        <div className="top"><img src={`${BASE}/img/logo.png`} alt="Keogh's Adventures" /><button className="x" aria-label="Close menu" onClick={() => setOpen(false)}><Icon.close /></button></div>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tours">Tours <small>{tours.length} trips</small></Link></li>
          <li><Link href="/tours?type=ride">Ride onboard <small>no 4WD needed</small></Link></li>
          <li><Link href="/about">About Tony</Link></li>
          <li><Link href="/news">Trip news</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <div className="foot">
          <a className="c" href={safeTel(st.phone)}><Icon.phone />{st.phone}</a>
          <a className="c" href={safeMailto(st.email)}><Icon.mail />{st.email}</a>
          <Link className="btn btn-primary btn-lg btn-block" href="/tours">Book a trip <Icon.arrow /></Link>
        </div>
      </div>
    </>
  );
}
