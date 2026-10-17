export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SEED } from "@/lib/seed";

const SITE_URL = "https://keoghsadventures.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tours`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...SEED.tours.filter((t) => t.published).map((t) => ({ url: `${SITE_URL}/tours/${t.id}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.6 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...SEED.posts.map((p) => ({ url: `${SITE_URL}/news/${p.id}`, lastModified: new Date(p.date), priority: 0.4 })),
    { url: `${SITE_URL}/contact`, lastModified: now, priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, priority: 0.3 },
  ];
}
