import { normalizePhone, safeHttpUrl } from "../../../utils/jobDisplay";

/**
 * Link helpers for untrusted (Telegram-sourced) values. A value is only turned
 * into an href when it passes these checks; otherwise callers render plain text.
 */

/**
 * Returns a normalized http(s) URL string, or null for anything else (other
 * schemes, URLs with embedded credentials, URLs over 2048 characters).
 * Shared with the public site so both apply the same rules.
 */
export { safeHttpUrl };

const EMAIL_PATTERN = /^[^\s@<>"'()[\],;:\\]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;

export const isValidEmailShape = (value: string) => value.length <= 254 && EMAIL_PATTERN.test(value);

/** mailto: href from a validated email, or null. */
export const safeMailto = (value: string | null | undefined): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!isValidEmailShape(trimmed)) return null;
  return `mailto:${encodeURIComponent(trimmed).replace(/%40/g, "@")}`;
};

/**
 * Phone helper for the review form: the exact normalization the backend applies
 * (separators removed, 08012345678 -> +2348012345678). Returns null for anything
 * that is not a valid phone; it never deletes letters to make a value pass.
 */
export { normalizePhone };

export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelative = (value: string | null | undefined): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDateTime(value);
};
