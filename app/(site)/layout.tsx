import { BASE } from "@/lib/base";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";
import Loader from "@/components/site/Loader";
import { SEED } from "@/lib/seed";

const SITE_URL = "https://keoghsadventures.com";

// Structured data so Google can show the business, phone and accreditation in search.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SEED.settings.businessName,
  legalName: SEED.settings.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.png`,
  image: `${SITE_URL}/img/canning-convoy.jpg`,
  telephone: SEED.settings.phone,
  email: SEED.settings.email,
  founder: { "@type": "Person", name: SEED.settings.owner },
  address: { "@type": "PostalAddress", addressLocality: "Perth", addressRegion: "WA", addressCountry: "AU" },
  areaServed: { "@type": "State", name: "Western Australia" },
  sameAs: [SEED.settings.facebook, SEED.settings.instagram],
  priceRange: "$249 – $9,450",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preload" as="image" href={`${BASE}/img/hero-poster-sm.jpg`} media="(max-width: 820px)" fetchPriority="high" />
      <link rel="preload" as="image" href={`${BASE}/img/hero-poster.jpg`} media="(min-width: 821px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Loader />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Reveal />
      <Link className="demo-link" href="/admin">Admin demo</Link>
    </>
  );
}
