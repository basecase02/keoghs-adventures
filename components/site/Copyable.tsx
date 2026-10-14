"use client";
import { useRef } from "react";
import { useUI } from "@/lib/ui";

/** Shows a phone/email as selectable text with a copy button (tel:/mailto: links are unreliable). */
export default function Copyable({ value, big }: { value: string; big?: boolean }) {
  const { toast } = useUI();
  const ref = useRef<HTMLSpanElement>(null);
  const copy = () => {
    (navigator.clipboard?.writeText(value) ?? Promise.reject()).then(() => toast("Copied")).catch(() => {
      const r = document.createRange(); r.selectNodeContents(ref.current!); const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
    });
  };
  return (
    <span className="copyable" ref={ref} style={big ? { fontFamily: "var(--font-display)", fontSize: "1.5rem" } : undefined}>
      {value} <button type="button" onClick={copy}>copy</button>
    </span>
  );
}
