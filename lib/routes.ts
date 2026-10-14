"use client";
import { useParams, useSearchParams } from "next/navigation";
import { SEED } from "./seed";

/*
 * The site is exported as static files, so only trips that exist at build
 * time get their own page (/tours/<id>/). Trips added later in the admin use
 * a shared page that reads the id from the address (/tours/trip/?id=<id>).
 */
const BUILT = new Set(SEED.tours.map((t) => t.id));

export const tourPath = (id: string) => (BUILT.has(id) ? `/tours/${id}` : `/tours/trip?id=${encodeURIComponent(id)}`);
export const bookPath = (id: string, dep?: string) => (BUILT.has(id) ? `/book/${id}${dep ? `?dep=${dep}` : ""}` : `/book/trip?id=${encodeURIComponent(id)}${dep ? `&dep=${dep}` : ""}`);
export const editPath = (id: string) => (BUILT.has(id) ? `/admin/tours/${id}` : `/admin/tours/edit?id=${encodeURIComponent(id)}`);

/** The trip id, from /x/<id>/ or from ?id=… on the shared page. */
export function useRouteId() {
  const p = useParams<{ id?: string }>();
  const q = useSearchParams();
  return (p?.id as string | undefined) || q.get("id") || "";
}
