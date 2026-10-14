"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fades in `.rv` elements as they scroll into view. Anything above the fold stays visible at rest. */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((el) => { if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("pre"); io.observe(el); } });
    return () => io.disconnect();
  }, [path]);
  return null;
}
