/**
 * Sub-path the site is served from. Empty locally and on a real domain;
 * "/keoghs-adventures" on GitHub Pages (set by the deploy workflow).
 * Plain <img> tags don't get Next's basePath automatically, so every image
 * path is built with this.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prototype switch. While true, the forms show a "demo" notice and the card
 * box only accepts Stripe's test card, so nobody can type a real card number
 * or real personal details into the public demo by mistake. Set
 * NEXT_PUBLIC_DEMO_MODE=off when the real backend and Stripe are connected.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "off";
export const TEST_CARD = "4242424242424242";
