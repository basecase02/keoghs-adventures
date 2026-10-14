import { SEED } from "@/lib/seed";

// Pre-build a page for every post so the site works as static files.
export function generateStaticParams() {
  return SEED.posts.map((p) => ({ id: p.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
