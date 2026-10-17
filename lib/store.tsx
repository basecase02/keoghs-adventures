"use client";
/**
 * Shared app state for the prototype. Starts from the seed data and keeps
 * edits in localStorage so the demo survives a refresh. In production this
 * becomes API calls to the AWS backend.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SEED } from "./seed";
import type { SeedData } from "./types";

const KEY = "ka-next-v4";
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

/*
 * Data validation (ACSC ISM: validate and sanitise all input). Anything read
 * back from the browser's storage, or written by the admin, is checked first:
 * strings lose control characters and are length-capped, numbers must be
 * finite, and dangerous object keys are dropped. If the saved data isn't the
 * right shape at all, we fall back to the original demo data.
 */
const MAX_STR = 5000;
const BAD_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const REQUIRED = ["tours", "regions", "customers", "bookings", "posts", "reviews", "faqs"] as const;

function scrub(v: unknown, depth = 0): unknown {
  if (depth > 8) return null;
  if (typeof v === "string") return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, MAX_STR);
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (Array.isArray(v)) return v.slice(0, 2000).map((x) => scrub(x, depth + 1));
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) if (!BAD_KEYS.has(k)) out[k] = scrub(val, depth + 1);
    return out;
  }
  return v;
}
function validState(x: unknown): x is SeedData {
  const o = x as Record<string, unknown> | null;
  return !!o && typeof o === "object" && !!o.settings && typeof o.settings === "object" && REQUIRED.every((k) => Array.isArray(o[k]));
}

interface StoreCtx {
  s: SeedData;
  /** Mutate the state in place, then persist and re-render. */
  update: (fn: (s: SeedData) => void) => void;
  reset: () => void;
  ready: boolean;
}
const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<SeedData>(() => clone(SEED));
  const [ready, setReady] = useState(false);
  const ref = useRef(s);
  ref.current = s;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && raw.length < 5_000_000) { const parsed = scrub(JSON.parse(raw)); if (validState(parsed)) setS(parsed); else localStorage.removeItem(KEY); }
    } catch { try { localStorage.removeItem(KEY); } catch {} }
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: SeedData) => void) => {
    const draft = clone(ref.current); fn(draft); const next = scrub(draft) as SeedData; ref.current = next; setS(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);
  const reset = useCallback(() => { try { localStorage.removeItem(KEY); } catch {} const next = clone(SEED); ref.current = next; setS(next); }, []);

  const value = useMemo(() => ({ s, update, reset, ready }), [s, update, reset, ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
