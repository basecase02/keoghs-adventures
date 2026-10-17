#!/usr/bin/env node
/**
 * Post-build step: turns the site's Content-Security-Policy from
 * "script-src 'self' 'unsafe-inline'" into a strict, hash-based policy.
 *
 * A static export has to ship a few small inline scripts (Next's own
 * start-up code). Instead of allowing ALL inline scripts, we compute a
 * SHA-256 fingerprint of each one that is actually in the page and list only
 * those. An attacker's injected script has a different fingerprint, so the
 * browser refuses to run it (ACSC ISM guidelines for software development:
 * Content-Security-Policy).
 *
 * Fails the build (exit 1) if any page has no policy, or still allows
 * 'unsafe-inline' scripts, or has an inline script missing from its list.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2] || "out";
const META = /<meta http-equiv="Content-Security-Policy" content="([^"]*)"\s*\/?>/;
const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const encode = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith(".html")) yield p;
  }
}

/** Inline, executable scripts only (no src, not a JSON data block). */
function inlineScripts(html) {
  const found = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/\btype\s*=\s*["']?(application\/ld\+json|application\/json|importmap)/i.test(attrs)) continue;
    if (m[2].trim() === "") continue;
    found.push(m[2]);
  }
  return found;
}

let files = 0, hashed = 0, problems = [];
for (const file of htmlFiles(OUT)) {
  let html = readFileSync(file, "utf8");
  const meta = html.match(META);
  if (!meta) { problems.push(`${file}: no Content-Security-Policy meta tag`); continue; }

  const hashes = [...new Set(inlineScripts(html).map((c) => `'sha256-${createHash("sha256").update(c, "utf8").digest("base64")}'`))];
  const directives = decode(meta[1]).split(";").map((d) => d.trim()).filter(Boolean).map((d) => {
    if (!d.startsWith("script-src")) return d;
    return ["script-src 'self'", ...hashes].join(" ");
  });
  const policy = directives.join("; ");
  html = html.replace(META, `<meta http-equiv="Content-Security-Policy" content="${encode(policy)}"/>`);
  writeFileSync(file, html);
  files++; hashed += hashes.length;

  // verify what we wrote
  const check = decode(readFileSync(file, "utf8").match(META)[1]);
  const scriptSrc = check.split(";").map((d) => d.trim()).find((d) => d.startsWith("script-src")) || "";
  if (/unsafe-inline|unsafe-eval/.test(scriptSrc)) problems.push(`${file}: script-src still allows unsafe code`);
  for (const c of inlineScripts(html)) {
    const h = `'sha256-${createHash("sha256").update(c, "utf8").digest("base64")}'`;
    if (!scriptSrc.includes(h)) problems.push(`${file}: inline script not covered by policy`);
  }
}

console.log(`CSP hardened: ${files} pages, ${hashed} unique inline-script hashes.`);
if (problems.length || files === 0) {
  console.error("CSP hardening FAILED:\n" + (problems.join("\n") || "no HTML files found in " + OUT));
  process.exit(1);
}
