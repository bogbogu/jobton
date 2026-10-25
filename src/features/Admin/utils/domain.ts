export const MAX_DOMAIN_LENGTH = 253;

export const DOMAIN_FORMAT_ERROR =
  "Use a plain website address like acme.com (no spaces, username or IP address).";

export type DomainParse = { ok: true; value: string } | { ok: false };

const LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

/**
 * Turns what a reviewer typed or pasted into a plain hostname.
 * "" -> "" (no website). "https://www.Acme.com/careers" -> "acme.com".
 * Anything that is not a plain public hostname (spaces, userinfo, IP address,
 * no dot, bad characters) is rejected, never silently altered.
 */
export const normalizeDomain = (raw: string): DomainParse => {
  const input = raw.trim();
  if (input === "") return { ok: true, value: "" };
  if (/\s/.test(input)) return { ok: false };

  let host: string;
  try {
    const hasScheme = SCHEME_PATTERN.test(input);
    const url = new URL(hasScheme ? input : `https://${input}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false };
    if (url.username || url.password) return { ok: false };
    host = url.hostname;
  } catch {
    return { ok: false };
  }

  host = host.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");

  if (host.length === 0 || host.length > MAX_DOMAIN_LENGTH) return { ok: false };

  const labels = host.split(".");
  if (labels.length < 2) return { ok: false };
  if (!labels.every((label) => LABEL_PATTERN.test(label))) return { ok: false };
  // The last label of a real hostname is never all digits, which also rules out IPv4 addresses.
  if (!/[a-z]/.test(labels[labels.length - 1])) return { ok: false };

  return { ok: true, value: host };
};
