import type { Job } from "../types/job-type";

// The API can return jobs with no company (e.g. jobs ingested from Telegram that
// do not name the employer). Everything that draws a job must cope with that.

export const NO_COMPANY_LABEL = "Company not listed";

export const companyName = (job: Pick<Job, "company">): string =>
  job.company?.trim() || NO_COMPANY_LABEL;

// Only link to a company page when the job really has a company and the API
// produced a usable slug (an old API bug returned the literal string "undefined").
export const companyPageSlug = (job: Pick<Job, "company" | "companySlug">): string | undefined => {
  const slug = job.companySlug?.trim();
  if (!job.company?.trim() || !slug || slug === "undefined" || slug === "null") return undefined;
  return slug;
};

// ---------------------------------------------------------------------------
// Apply-contact helpers. The values originate from untrusted Telegram posts
// (validated by the backend, but treated as untrusted here). Each helper returns
// a safe value or null; callers fall back to showing plain text without an action.
// ---------------------------------------------------------------------------

const MAX_URL_LENGTH = 2048;

// Returns the normalized URL only for well-formed http(s) URLs. URLs that embed
// credentials (https://trusted.com@evil.com/) and absurdly long URLs are refused.
export const safeHttpUrl = (value?: string | null): string | null => {
  const raw = value?.trim();
  if (!raw || raw.length > MAX_URL_LENGTH) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
};

// Conservative address check: no whitespace, quotes, "?", "&", etc. so the
// resulting mailto: can never carry extra parameters such as ?cc= or &subject=.
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export const isSafeEmail = (value?: string | null): boolean => {
  const email = value?.trim();
  return !!email && email.length <= 254 && EMAIL_PATTERN.test(email);
};

// "mailto:<address>" exactly, or null when the address is not conservative.
export const safeMailtoHref = (value?: string | null): string | null => {
  const email = value?.trim();
  if (!email || !isSafeEmail(email)) return null;
  // The pattern only allows [A-Za-z0-9._%+-] before "@" and an ASCII domain, so
  // the only character needing escaping is a literal "%" (it would read as an escape).
  return `mailto:${email.replace(/%/g, "%25")}`;
};

// Mirrors the backend: strips ONLY spaces, dashes, dots and parentheses, keeps an
// optional leading "+", turns Nigerian local numbers (0[789]xxxxxxxxx) and
// 234xxxxxxxxxx into +234..., then requires ^\+?[0-9]{7,15}$. Letters or other
// characters are never deleted to make a value valid: they make it invalid (null).
export const normalizePhone = (value?: string | null): string | null => {
  const cleaned = value?.trim().replace(/[\s\-.()]/g, "");
  if (!cleaned || !/^\+?[0-9]+$/.test(cleaned)) return null;

  let normalized = cleaned;
  if (!normalized.startsWith("+")) {
    if (/^0[789][0-9]{9}$/.test(normalized)) normalized = `+234${normalized.slice(1)}`;
    else if (/^234[0-9]{10}$/.test(normalized)) normalized = `+${normalized}`;
  }

  return /^\+?[0-9]{7,15}$/.test(normalized) ? normalized : null;
};

export const safeTelHref = (value?: string | null): string | null => {
  const phone = normalizePhone(value);
  return phone ? `tel:${phone}` : null;
};

// wa.me wants digits only (no "+") and only works with a country code, so numbers
// without a leading "+" get no WhatsApp link.
export const safeWhatsAppHref = (value?: string | null): string | null => {
  const phone = normalizePhone(value);
  return phone && phone.startsWith("+") ? `https://wa.me/${phone.slice(1)}` : null;
};
