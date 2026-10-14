"use client";
/** Toasts and a promise-based confirm dialog, shared by the site and the admin. */
import { createContext, useCallback, useContext, useRef, useState } from "react";

type Kind = "ok" | "bad";
interface ConfirmOpts { title: string; text: string; ok?: string; cancel?: string; danger?: boolean }
interface UICtx { toast: (msg: string, kind?: Kind) => void; confirm: (o: ConfirmOpts) => Promise<boolean> }
const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: Kind; fade: boolean }[]>([]);
  const [dlg, setDlg] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const n = useRef(0);

  const toast = useCallback((msg: string, kind: Kind = "ok") => {
    const id = ++n.current;
    setToasts((t) => [...t, { id, msg, kind, fade: false }]);
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, fade: true } : x))), 2600);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setDlg({ ...o, resolve })), []);
  const close = (v: boolean) => { dlg?.resolve(v); setDlg(null); };

  return (
    <Ctx.Provider value={{ toast, confirm }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`} style={t.fade ? { opacity: 0, transition: "opacity .3s" } : undefined}>{t.msg}</div>
        ))}
      </div>
      {dlg && (
        <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) close(false); }}>
          <div className="modal" role="dialog" aria-modal="true">
            <h3>{dlg.title}</h3>
            <p>{dlg.text}</p>
            <div className="acts">
              <button className="btn btn-soft btn-sm" onClick={() => close(false)}>{dlg.cancel || "Cancel"}</button>
              <button className={`btn btn-sm ${dlg.danger ? "btn-danger" : "btn-primary"}`} onClick={() => close(true)}>{dlg.ok || "Yes, do it"}</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be used inside UIProvider");
  return c;
}
