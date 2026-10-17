import { isEmail } from "./utils";

/**
 * The home headline and top banner are edited by Tony in the admin and allow
 * two bits of styling: <em> (gold italic word) and <b> (highlight). Everything
 * else is escaped, so text typed into the admin can never inject scripts or
 * links into the public site (XSS protection).
 */
const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function safeInlineHtml(input: string, maxLength = 300): string {
  const escaped = String(input ?? "").slice(0, maxLength).replace(/[&<>"']/g, (c) => ESC[c]);
  // re-allow only these exact, attribute-free tags
  return escaped.replace(/&lt;(\/?)(em|b)&gt;/g, "<$1$2>");
}

/** Plain text for form fields: trims, strips control characters and caps the length. */
export function cleanText(input: string, maxLength: number): string {
  return String(input ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

/** Links typed in the admin (Facebook, Instagram): only real https:// web addresses are allowed. */
export function safeUrl(input: string, fallback = "#"): string {
  try {
    const u = new URL(String(input ?? "").trim());
    return u.protocol === "https:" ? u.href : fallback;
  } catch {
    return fallback;
  }
}

/** mailto: links only for a valid email address, so odd text can't add hidden recipients or headers. */
export function safeMailto(input: string): string {
  const e = String(input ?? "").trim();
  return isEmail(e) && !/[?&=\s]/.test(e) ? `mailto:${e}` : "#";
}

/** tel: links only for a plausible phone number (digits, optional leading +). */
export function safeTel(input: string): string {
  const d = String(input ?? "").replace(/[\s().-]/g, "");
  return /^\+?\d{8,15}$/.test(d) ? `tel:${d}` : "#";
}
