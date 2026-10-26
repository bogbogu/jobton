import { safeHttpUrl } from "./safeLinks";

/** Telegram's image CDN hosts (cdn1.cdn-telegram.org, cdn4.telesco.pe, ...). */
const TELEGRAM_CDN_HOST = /^cdn\d*\.(cdn-telegram\.org|telesco\.pe)$/i;

/**
 * Returns a normalized https URL only when it is a valid http(s) URL on Telegram's
 * CDN; anything else (other hosts, other schemes, junk, non-strings) returns null
 * and is not rendered at all.
 */
export const safeTelegramImageUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const safe = safeHttpUrl(value);
  if (!safe) return null;
  try {
    const url = new URL(safe);
    if (url.protocol !== "https:") return null;
    return TELEGRAM_CDN_HOST.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
};

/** The renderable image URLs of a post: validated, de-duplicated, at most 3. */
export const telegramImageUrls = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const urls = value.map(safeTelegramImageUrl).filter((url): url is string => url !== null);
  return [...new Set(urls)].slice(0, 3);
};
