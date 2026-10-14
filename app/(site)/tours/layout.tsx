import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "4WD tours and dates",
  description: "Every Keogh's Adventures departure with live prices and seat counts: Canning Stock Route, Kimberley and Gibb River Road, Eyre to Esperance and Southwest coastal tours.",
  alternates: { canonical: "/tours" },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
