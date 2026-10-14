import { BASE } from "@/lib/base";
import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { UIProvider } from "@/lib/ui";
import "./globals.css";

// Archivo pushed wide reads like 4WD badging; Instrument Serif italics carry the feeling; Hanken Grotesk keeps body copy easy.
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--nf-display", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nf-serif", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--nf-body", display: "swap" });

const SITE_URL = "https://keoghsadventures.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Keogh's Adventures · Small-group 4WD tours in Western Australia", template: "%s · Keogh's Adventures" },
  description: "Tag-along and ride-onboard 4WD tours across Western Australia with Tony Keogh: Canning Stock Route, Gibb River Road and the Kimberley, Eyre to Esperance and the Southwest coast. Small groups, max six vehicles.",
  keywords: ["4WD tours Western Australia", "tag along tours WA", "Canning Stock Route tour", "Gibb River Road tour", "Kimberley 4WD tour", "ride onboard 4WD tour", "Perth 4WD tours"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_AU", siteName: "Keogh's Adventures", url: SITE_URL,
    title: "Keogh's Adventures · 4WD tours across Western Australia",
    description: "Small-group tag-along and ride-onboard 4WD tours to the most remote corners of WA.",
    images: [{ url: `${BASE}/img/canning-convoy.jpg`, width: 1300, height: 1260, alt: "Keogh's Adventures convoy on the Canning Stock Route" }],
  },
  twitter: { card: "summary_large_image", images: [`${BASE}/img/canning-convoy.jpg`] },
  icons: { icon: `${BASE}/img/logo.png`, apple: `${BASE}/img/logo.png` },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#100D0A" };

// Show the intro loader once per browser session; set before paint so return visits never flash it.
const seenScript = `try{if(sessionStorage.getItem('ka-seen'))document.documentElement.dataset.seen='1';else sessionStorage.setItem('ka-seen','1')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${serif.variable} ${body.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: seenScript }} /></head>
      <body>
        <StoreProvider>
          <UIProvider>{children}</UIProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
