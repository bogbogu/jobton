import { useState } from "react";

interface CompanyLogoProps {
  company?: string;
  domain?: string;
  logoUrl?: string | null;
  className?: string;
}

// Soft tints so named companies without a logo are told apart at a glance.
// Chosen from a hash of the name, so a company always gets the same colour.
const AVATAR_TINTS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200",
];

const tintFor = (name: string): string => {
  let hash = 0;
  for (const char of name.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
};

const BOX = "h-14 w-14 shrink-0 rounded-xl flex items-center justify-center";

const CompanyLogo = ({
  company,
  domain,
  logoUrl,
  className,
}: CompanyLogoProps) => {
  const name = company?.trim() ?? "";
  const cleanDomain = domain?.trim() ?? "";
  const fallbackLogo = cleanDomain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`
    : null;

  // Nothing to load means no request at all: go straight to the avatar.
  const [src, setSrc] = useState<string | null>(logoUrl || fallbackLogo);

  const handleError = () => {
    setSrc((current) => (current !== fallbackLogo ? fallbackLogo : null));
  };

  if (!src) {
    if (!name) {
      // The employer is unknown (common for jobs from Telegram): a neutral
      // building, not a letter or "?" that looks like a broken image.
      return (
        <div
          role="img"
          aria-label="Employer not listed"
          className={`${BOX} bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400 ${className ?? ""}`}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
            <path d="M14 10h5a1 1 0 0 1 1 1v10" />
            <path d="M3 21h18" />
            <path d="M8 8h2M8 12h2M8 16h2" />
          </svg>
        </div>
      );
    }

    return (
      <div
        aria-hidden="true"
        className={`${BOX} font-bold text-xl ${tintFor(name)} ${className ?? ""}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Company logo"}
      className={`h-14 w-14 shrink-0 rounded-xl object-contain ${className ?? ""}`}
      onError={handleError}
    />
  );
};

export default CompanyLogo;
