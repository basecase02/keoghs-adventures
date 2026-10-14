"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon, type IconName } from "@/lib/icons";
import { initials } from "@/lib/utils";
import BookingSheet from "./BookingSheet";

interface AdminCtx { openBooking: (id: string) => void; closeSheet: () => void }
const Ctx = createContext<AdminCtx | null>(null);
export const useAdmin = () => { const c = useContext(Ctx); if (!c) throw new Error("useAdmin outside AdminShell"); return c; };

const NAV: [string, string, IconName][] = [
  ["", "Home", "home"], ["bookings", "Bookings", "book"], ["tours", "Trips", "tour"], ["website", "Website", "content"], ["settings", "Settings", "set"],
];

function Login({ onIn }: { onIn: () => void }) {
  return (
    <div className="login">
      <div className="art"><img src={`${BASE}/img/canning-track.jpg`} alt="" /><h2 className="t-1">G&apos;day, <em>Tony</em>.</h2></div>
      <div className="fs">
        <form onSubmit={(e) => { e.preventDefault(); onIn(); }}>
          <img src={`${BASE}/img/logo.png`} alt="Keogh's Adventures" />
          <h1>Sign in</h1>
          <p style={{ color: "var(--ink-3)" }}>Look after your bookings, trips and website from here.</p>
          <div className="field"><label htmlFor="le">Email</label><input type="email" id="le" defaultValue="tony@keoghsadventures.com" autoComplete="username" /></div>
          <div className="field"><label htmlFor="lp">Password</label><input type="password" id="lp" defaultValue="demo-password" autoComplete="current-password" /></div>
          <div className="field"><label htmlFor="lc">6-digit code from your phone</label><input type="text" id="lc" inputMode="numeric" defaultValue="482 913" autoComplete="one-time-code" /><span className="hint">This extra step keeps your guests&apos; details safe.</span></div>
          <button className="btn btn-primary btn-lg btn-block" type="submit">Sign in <Icon.arrow /></button>
          <p className="small" style={{ textAlign: "center", color: "var(--ink-3)" }}>Prototype: the details are already filled in.</p>
        </form>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { s } = useStore();
  const { toast } = useUI();
  const path = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sheet, setSheet] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("in-admin");
    try { setAuthed(sessionStorage.getItem("ka-admin") === "1"); } catch { setAuthed(false); }
    return () => document.documentElement.classList.remove("in-admin");
  }, []);
  useEffect(() => { setSheet(null); window.scrollTo({ top: 0 }); }, [path]);

  if (authed === null) return <div className="adm" />;
  if (!authed) return <Login onIn={() => { try { sessionStorage.setItem("ka-admin", "1"); } catch {} setAuthed(true); toast("Welcome back, Tony"); }} />;

  const seg = path.replace(/^\/admin\/?/, "").split("/")[0];
  const items = NAV.map(([k, l, ic]) => { const I = Icon[ic]; return <Link key={k} href={`/admin${k ? "/" + k : ""}`} className={seg === k ? "on" : ""} aria-current={seg === k ? "page" : undefined}><I />{l}</Link>; });

  return (
    <Ctx.Provider value={{ openBooking: setSheet, closeSheet: () => setSheet(null) }}>
      <div className="adm">
        <aside className="aside">
          <Link className="brand" href="/"><img src={`${BASE}/img/logo.png`} alt="Keogh's Adventures" /></Link>
          <nav className="anav" aria-label="Admin">{items}</nav>
          <div className="who"><span className="av">{initials(s.settings.owner)}</span><span>{s.settings.owner}<small>Owner</small></span></div>
          <Link className="out" href="/" style={{ textDecoration: "none", color: "var(--mist)" }}>← Back to website</Link>
          <button className="out" onClick={() => { try { sessionStorage.removeItem("ka-admin"); } catch {} setAuthed(false); }}>Sign out</button>
        </aside>
        <div className="amob"><img src={`${BASE}/img/logo.png`} alt="Keogh's Adventures" /><Link href="/"><Icon.eye /> Website</Link></div>
        <main className="amain">{children}</main>
        <nav className="tabbar" aria-label="Admin">{items}</nav>
      </div>
      {sheet && <BookingSheet id={sheet} />}
    </Ctx.Provider>
  );
}

/** Sticky bar that appears only when there are unsaved changes. */
export function SaveBar({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  return (
    <div className="savebar" role="status">
      <span>You have unsaved changes</span>
      <span className="row"><button className="btn btn-quiet btn-sm" onClick={onDiscard}>Undo</button><button className="btn btn-primary" onClick={onSave}>Save changes</button></span>
    </div>
  );
}
