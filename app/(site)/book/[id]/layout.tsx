import { SEED } from "@/lib/seed";

// Pre-build a page for every tour so the site works as static files.
export function generateStaticParams() {
  return SEED.tours.map((t) => ({ id: t.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
