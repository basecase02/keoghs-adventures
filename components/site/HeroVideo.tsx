"use client";
import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/base";

/**
 * Home hero background. The poster image paints instantly; the video is
 * attached only after the page has loaded, sized to the screen (0.7 MB on
 * phones, 2 MB on desktop), and skipped entirely for data-saver or
 * reduced-motion visitors.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || "")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pick = () => setSrc(`${BASE}/video/${window.innerWidth <= 820 ? "hero-sm" : "hero"}.mp4`);
    // wait for the page to finish loading so the video never competes with text, fonts and the poster
    if (document.readyState === "complete") { const t = setTimeout(pick, 300); return () => clearTimeout(t); }
    const onLoad = () => setTimeout(pick, 300);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => { if (src) ref.current?.play().catch(() => {}); }, [src]);

  return (
    <>
      <picture>
        <source media="(max-width: 820px)" srcSet={`${BASE}/img/hero-poster-sm.jpg`} />
        <img className="hero-still on" src={`${BASE}/img/hero-poster.jpg`} alt="A 4WD driving a red dirt track through the Australian outback" fetchPriority="high" decoding="async" />
      </picture>
      {src && (
        <video ref={ref} className={playing ? "on" : ""} src={src} muted loop playsInline autoPlay preload="auto" aria-hidden="true" onPlaying={() => setPlaying(true)} />
      )}
    </>
  );
}
