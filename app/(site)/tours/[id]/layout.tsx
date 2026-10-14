import type { Metadata } from "next";
import { SEED } from "@/lib/seed";
import { lowestPrice } from "@/lib/utils";

const SITE_URL = "https://keoghsadventures.com";

export function generateStaticParams() {
  return SEED.tours.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = SEED.tours.find((x) => x.id === id);
  if (!t) return { title: "Tour" };
  return {
    title: `${t.name} · ${t.days}-day 4WD tour`,
    description: `${t.summary.slice(0, 150)} From $${lowestPrice(t).toLocaleString()} per person.`,
    alternates: { canonical: `/tours/${t.id}` },
    openGraph: { title: t.name, description: t.summary, images: [{ url: t.cover, alt: t.name }] },
  };
}

export default async function TourLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = SEED.tours.find((x) => x.id === id);
  // TouristTrip + offers lets Google show the trip, price and dates in search results.
  const jsonLd = t && {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t.name,
    description: t.summary,
    image: `${SITE_URL}${t.cover}`,
    touristType: t.types.map((x) => (x === "ride" ? "Ride onboard" : "Tag along")),
    itinerary: { "@type": "ItemList", itemListElement: t.itinerary.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `Day ${d.day}: ${d.title}` })) },
    provider: { "@type": "TravelAgency", name: SEED.settings.businessName, url: SITE_URL },
    offers: t.departures.map((d) => ({
      "@type": "Offer", price: lowestPrice(t), priceCurrency: "AUD", validFrom: "2026-01-01",
      availability: d.seats - d.booked > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: `${SITE_URL}/tours/${t.id}`, availabilityStarts: d.date,
    })),
  };
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {children}
    </>
  );
}
