"use client";
import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/base";

/**
 * Home hero background. The poster image paints instantly; the video is
 * attached only after the page has loaded, sized to the screen (1.6 MB on
 * phones, 3.8 MB laptops, 7.2 MB large screens), and skipped for data-saver or
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
    // phones 854p, laptops 1280p, big/high-res screens full 1080p; each starts playing while it downloads
    const pick = () => {
      const w = window.innerWidth, px = w * Math.min(window.devicePixelRatio || 1, 2);
      setSrc(`${BASE}/video/${w <= 820 ? "hero-sm" : px > 1700 && w > 1100 ? "hero-1080" : "hero"}.mp4`);
    };
    // start right after the first paint (poster already on screen); the file is
    // "fast start" encoded, so it plays as soon as the first part has arrived
    const raf = requestAnimationFrame(() => requestAnimationFrame(pick));
    return () => cancelAnimationFrame(raf);
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
