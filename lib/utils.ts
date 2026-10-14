import type { Booking, Departure, SeedData, Tour, TravelStyle } from "./types";

/** The prototype runs against a fixed "today" so the example data always lines up. */
export const TODAY = "2026-10-14";
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export const money = (n: number | null | undefined, dec = 0) =>
  "$" + Number(n || 0).toLocaleString("en-AU", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const parseD = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
export const fmtDate = (iso: string) => { const d = parseD(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
export const fmtShort = (iso: string) => { const d = parseD(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const fmtDay = (iso: string) => { const d = parseD(iso); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
export const fmtDT = (iso: string) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
export const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (iso: string, n: number) => { const d = parseD(iso); d.setDate(d.getDate() + n); return toISO(d); };
export const daysBetween = (a: string, b: string) => Math.round((parseD(b).getTime() - parseD(a).getTime()) / 86400000);
export const monthKey = (iso: string) => iso.slice(0, 7);

export const seatsLeft = (dep: Departure) => Math.max(0, dep.seats - dep.booked);
export const seatsClass = (n: number) => (n === 0 ? "full" : n <= 2 ? "low" : "");
export const seatsText = (n: number) => (n === 0 ? "Sold out" : n === 1 ? "1 seat left" : `${n} seats left`);
export const typeLabel = (t: TravelStyle) => (t === "ride" ? "Ride Onboard" : "Tag Along");
export const initials = (n: string) => n.split(/\s+/).filter((w) => /^\p{L}/u.test(w) && !/^(the|and)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
export const lowestPrice = (t: Tour) => Math.min(...(["tag", "ride"] as const).map((k) => t.price[k]).filter((p): p is number => !!p));
export const nextDeparture = (t: Tour) => t.departures.filter((d) => d.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0];
export const paidOf = (b: Booking) => b.payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);

export const tourById = (s: SeedData, id: string) => s.tours.find((t) => t.id === id);
export const depById = (t: Tour, id: string) => t.departures.find((d) => d.id === id);
export const custById = (s: SeedData, id: string) => s.customers.find((c) => c.id === id);
export const depositOf = (s: SeedData, total: number) => Math.round((total * s.settings.depositPercent) / 100 * 100) / 100;
export const balanceDue = (s: SeedData, b: Booking) => {
  const t = tourById(s, b.tourId)!; const d = depById(t, b.depId)!;
  return { owed: b.total - paidOf(b), date: addDays(d.date, -s.settings.balanceDueDays) };
};
export const upcomingDeps = (s: SeedData) =>
  s.tours.flatMap((t) => t.departures.filter((d) => d.date >= TODAY).map((d) => ({ t, d }))).sort((a, b) => a.d.date.localeCompare(b.d.date));
export const statusOf = (b: Booking): [string, string] =>
  b.status === "paid" ? ["ok", "Paid in full"] : b.status === "failed" ? ["bad", "Payment failed"] : b.status === "cancelled" ? ["muted", "Cancelled"] : ["warn", "Deposit paid"];

export const uid = (p: string) => p + Math.random().toString(36).slice(2, 8);

/* ---------- form validation ---------- */
/** Practical email check: something@domain.tld, no spaces, a real-looking TLD. */
export const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
export const isEmail = (v: string) => v.length <= 254 && EMAIL_RE.test(v.trim());
/** Australian mobile or landline, with or without +61 / spaces / brackets. Overseas numbers in +CC form are accepted too. */
export const isPhone = (v: string) => {
  const d = v.replace(/[\s()-]/g, "");
  return /^(?:\+?61|0)[2-478]\d{8}$/.test(d) || /^\+(?!61)\d{7,15}$/.test(d);
};
export const isName = (v: string) => /^[\p{L}][\p{L}' .-]{0,59}$/u.test(v.trim());

type Rules<T> = { [K in keyof T]?: (v: T[K]) => string | null };
/** Returns { field: message } for every field that fails. */
export function validate<T>(values: T, rules: Rules<T>) {
  const errs: Partial<Record<keyof T, string>> = {};
  (Object.keys(rules) as (keyof T)[]).forEach((k) => { const m = rules[k]!(values[k]); if (m) errs[k] = m; });
  return errs;
}

/** Contact details stay hidden in the admin until someone deliberately reveals them. */
export const maskEmail = (e: string) => { const [u, d] = e.split("@"); return d ? `${u[0]}•••@${d}` : "•••"; };
export const maskPhone = (p: string) => p.replace(/\d(?=(?:\D*\d){3})/g, "•");
