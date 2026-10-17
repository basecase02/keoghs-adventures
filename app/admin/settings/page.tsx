"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import { SaveBar } from "@/components/admin/AdminShell";
import type { Settings } from "@/lib/types";
import { money } from "@/lib/utils";

const FIELDS: [keyof Settings, string, string?][] = [
  ["businessName", "Business name"], ["phone", "Phone", "tel"], ["email", "Email", "email"],
  ["location", "Based in"], ["abn", "ABN"], ["facebook", "Facebook link"], ["instagram", "Instagram link"],
];
const SAFE = [
  ["Two-step sign-in", "A code from your phone is needed to get in here."],
  ["Kept in Australia", "Guest details are stored on secure servers in Sydney."],
  ["No card numbers", "Payments go straight to Stripe. You never see or store card details."],
  ["Consent on record", "Every booking saves when the guest agreed to your privacy notice."],
  ["Hidden until needed", "Guest phone numbers and emails stay hidden until you tap Show."],
  ["Cleared when done", "Guest contact details are deleted 2 years after their trip. Payment records stay 5 years for the ATO."],
];

export default function SettingsPage() {
  const { s, update, reset, ready } = useStore();
  const { toast, confirm } = useUI();
  const [d, setD] = useState<Settings | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (ready && !d) setD({ ...s.settings }); }, [ready, d, s.settings]);
  if (!d) return null;
  const set = (p: Partial<Settings>) => { setD({ ...d, ...p }); setDirty(true); };

  return (
    <>
      <div className="ahead"><h1>Settings</h1><p>Your business details and booking rules. You won&apos;t need to change these often.</p></div>

      <details className="acc" open>
        <summary><span><b>Your business details</b><small>Shown at the bottom of every page</small></span></summary>
        <div className="body form">{FIELDS.map(([k, l, type]) => (
          <div key={k} className="field"><label htmlFor={`s-${k}`}>{l}</label><input id={`s-${k}`} type={type || "text"} maxLength={200} value={String(d[k])} onChange={(e) => set({ [k]: e.target.value } as Partial<Settings>)} /></div>
        ))}</div>
      </details>

      <details className="acc">
        <summary><span><b>Deposits and payments</b><small>{d.depositPercent}% deposit · balance {d.balanceDueDays} days before</small></span></summary>
        <div className="body form">
          <div className="field"><label htmlFor="dp">Deposit (%)</label><input id="dp" type="number" inputMode="numeric" min="0" max="100" value={d.depositPercent} onChange={(e) => set({ depositPercent: Number(e.target.value) })} /><span className="hint">A $5,650 trip takes {money((5650 * d.depositPercent) / 100)} upfront.</span></div>
          <div className="field"><label htmlFor="bd">Balance due (days before the trip)</label><input id="bd" type="number" inputMode="numeric" min="0" value={d.balanceDueDays} onChange={(e) => set({ balanceDueDays: Number(e.target.value) })} /></div>
          <div className="field"><label htmlFor="mg">Most vehicles on one trip</label><input id="mg" type="number" inputMode="numeric" min="1" value={d.maxGroup} onChange={(e) => set({ maxGroup: Number(e.target.value) })} /></div>
          <div className="field"><label htmlFor="rd">Remind guests (days before balance is due)</label><input id="rd" type="number" inputMode="numeric" min="0" value={d.reminderDays} onChange={(e) => set({ reminderDays: Number(e.target.value) })} /></div>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>How guest details are kept safe</b><small>Built to Australian privacy law</small></span></summary>
        <div className="body">
          <div className="safe">{SAFE.map(([b, sm]) => <div key={b}><span className="ic"><Icon.tick /></span><span><b>{b}</b><small>{sm}</small></span></div>)}</div>
          <p className="small" style={{ color: "var(--ink-3)" }}>Follows the Australian Privacy Principles (Privacy Act 1988), the Spam Act 2003 for marketing emails, and the ACSC Essential Eight for sign-in.</p>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Demo</b><small>For this prototype only</small></span></summary>
        <div className="body">
          <p style={{ color: "var(--ink-3)" }}>Changes in this demo are saved in this browser. Reset to start fresh.</p>
          <button className="btn btn-danger" style={{ justifySelf: "start" }} onClick={async () => { if (await confirm({ title: "Reset the demo?", text: "Everything goes back to the original example data.", ok: "Reset", danger: true })) { reset(); setD(null); setDirty(false); toast("Demo reset"); } }}>Reset demo data</button>
        </div>
      </details>

      {dirty && <SaveBar onSave={() => {
        const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(Number.isFinite(n) ? n : lo)));
        const clean = { ...d, depositPercent: clamp(d.depositPercent, 0, 100), balanceDueDays: clamp(d.balanceDueDays, 0, 365), maxGroup: clamp(d.maxGroup, 1, 50), reminderDays: clamp(d.reminderDays, 0, 365) };
        update((st) => { st.settings = clean; }); setD(clean); setDirty(false); toast("Settings saved");
      }} onDiscard={() => { setD({ ...s.settings }); setDirty(false); }} />}
    </>
  );
}
