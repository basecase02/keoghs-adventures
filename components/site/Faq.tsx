"use client";
import { useStore } from "@/lib/store";

export default function Faq() {
  const { s } = useStore();
  return (
    <div className="faq">
      {s.faqs.map((f, i) => <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div>
  );
}
