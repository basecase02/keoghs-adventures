"use client";
import { Suspense } from "react";
import Page from "../[id]/page";

/** Shared page for trips added after the site was built (reads ?id=). */
export default function SharedTripPage() {
  return <Suspense><Page /></Suspense>;
}
