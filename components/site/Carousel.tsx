"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Horizontal swipe row. On phones it is a native scroll-snap strip with the
 * next card peeking in; on larger screens arrow buttons page through it.
 * `size` picks how many cards show per screen (see .car-* in globals.css).
 */
export default function Carousel({ head, size = "3", label, children }: {
  head?: React.ReactNode; size?: "2" | "3" | "4" | "photos"; label: string; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ start: true, end: false, frac: 0, view: 1 });

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const read = () => {
      const max = el.scrollWidth - el.clientWidth;
      setPos({ start: el.scrollLeft < 6, end: el.scrollLeft > max - 6, frac: max > 0 ? el.scrollLeft / max : 0, view: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1 });
    };
    read();
    el.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => { el.removeEventListener("scroll", read); window.removeEventListener("resize", read); };
  }, []);

  const page = (dir: 1 | -1) => { const el = ref.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.92, behavior: "smooth" }); };
  const scrollable = pos.view < 0.995;

  return (
    <div>
      <div className="car-head">
        <div>{head}</div>
        {scrollable && (
          <div className="car-ctl">
            <button aria-label="Previous" disabled={pos.start} onClick={() => page(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg></button>
            <button aria-label="Next" disabled={pos.end} onClick={() => page(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></button>
          </div>
        )}
      </div>
      <div ref={ref} className={`car-track car-${size}`} role="region" aria-label={label} tabIndex={0}>{children}</div>
      {scrollable && (
        <div className="car-bar" aria-hidden="true"><i style={{ width: `${Math.max(12, pos.view * 100)}%`, transform: `translateX(${pos.frac * (100 / Math.max(pos.view, 0.12) - 100)}%)` }} /></div>
      )}
    </div>
  );
}
