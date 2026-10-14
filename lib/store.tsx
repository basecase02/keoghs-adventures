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
    try { const raw = localStorage.getItem(KEY); if (raw) setS(JSON.parse(raw)); } catch {}
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: SeedData) => void) => {
    const next = clone(ref.current); fn(next); ref.current = next; setS(next);
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
