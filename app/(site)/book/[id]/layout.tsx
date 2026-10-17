import { Suspense } from "react";
import type { Metadata } from "next";
import { SEED } from "@/lib/seed";

export const metadata: Metadata = { title: "Book your trip", robots: { index: false, follow: false } };

// Pre-build a page for every tour so the site works as static files.
export function generateStaticParams() {
  return SEED.tours.map((t) => ({ id: t.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
