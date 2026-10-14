import type { NextConfig } from "next";

// Set to "/keoghs-adventures" by the GitHub Pages workflow; empty for local dev or a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",      // plain HTML/CSS/JS in out/, so it can be hosted anywhere (GitHub Pages, S3, …)
  basePath,
  trailingSlash: true,   // /tours/ -> tours/index.html, which static hosts serve reliably
  images: { unoptimized: true },
};

export default nextConfig;
