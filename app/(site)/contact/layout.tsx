import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Tony",
  description: "Ask Tony Keogh about a 4WD tour, your vehicle or a private trip for your group. Based in Perth, Western Australia.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
