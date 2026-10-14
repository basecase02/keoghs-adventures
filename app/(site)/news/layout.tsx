import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip news",
  description: "Trip reports and updates from Keogh's Adventures: Canning Stock Route crossings, new tour vehicles and new dates.",
  alternates: { canonical: "/news" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
