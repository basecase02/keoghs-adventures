/**
 * Sub-path the site is served from. Empty locally and on a real domain;
 * "/keoghs-adventures" on GitHub Pages (set by the deploy workflow).
 * Plain <img> tags don't get Next's basePath automatically, so every image
 * path is built with this.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
