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

// Only this site may provide scripts, styles, fonts, images, video and form targets.
// During the build, scripts/harden-csp.mjs replaces 'unsafe-inline' for scripts with the exact SHA-256 hashes of
// the page's own inline scripts, so injected scripts can't run. (Styles still allow inline: they can't execute code.)
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Show the intro loader once per browser session; set before paint so return visits never flash it.
// Clickjacking defence for hosts that can't send X-Frame-Options (e.g. GitHub Pages): the page stays blank
// (see html:not([data-top]) in globals.css) unless it is the top window; if it is framed, it breaks out.
const seenScript = `try{if(self===top){document.documentElement.dataset.top='1'}else{top.location.replace(self.location.href)}}catch(e){}try{if(sessionStorage.getItem('ka-seen'))document.documentElement.dataset.seen='1';else sessionStorage.setItem('ka-seen','1')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${serif.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Security policy for the live site (dev server needs eval + websockets, so it's production only).
            Add https://js.stripe.com and https://api.stripe.com here when Stripe is connected. */}
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script dangerouslySetInnerHTML={{ __html: seenScript }} />
      </head>
      <body>
        <StoreProvider>
          <UIProvider>{children}</UIProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
