import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const inputClasses =
  "min-h-11 w-full scroll-mt-24 scroll-mb-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 sm:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

export const invalidInputClasses = "border-red-500 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500";

export const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900";

export const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900";

export const dangerButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900";

export const dangerOutlineButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40 dark:focus-visible:ring-offset-slate-900";

export const cardClasses =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900";

export const ErrorBanner = ({ children }: { children: ReactNode }) => (
  <p
    role="alert"
    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
  >
    {children}
  </p>
);

export const NoticeBanner = ({ children }: { children: ReactNode }) => (
  <p
    role="status"
    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300"
  >
    {children}
  </p>
);

export const Chip = ({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "green" | "amber" | "red" | "blue";
}) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

type LinkKind = { label: string; tone: "green" | "amber" | "slate"; icon: "good" | "weak" | "neutral" };

const LINK_KINDS: Record<string, LinkKind> = {
  ats: { label: "Job-board link", tone: "green", icon: "good" },
  company_domain: { label: "Company website", tone: "green", icon: "good" },
  other_domain: { label: "Other website", tone: "slate", icon: "neutral" },
  form: { label: "Form link", tone: "amber", icon: "weak" },
  social_or_short: { label: "Chat or short link", tone: "amber", icon: "weak" },
  none: { label: "No link", tone: "amber", icon: "weak" },
};

/** What kind of application link the job has. Icon and words, not only color. */
export const LinkClassBadge = ({ linkClass }: { linkClass?: string }) => {
  const kind: LinkKind = LINK_KINDS[linkClass || "none"] ?? {
    label: "Other website",
    tone: "slate",
    icon: "neutral",
  };
  const Icon = kind.icon === "good" ? CheckCircle2 : kind.icon === "weak" ? AlertTriangle : Info;

  return (
    <Chip tone={kind.tone}>
      <Icon size={12} aria-hidden="true" className="mr-1 shrink-0" />
      {kind.label}
      <span className="sr-only">{kind.icon === "good" ? " (good)" : kind.icon === "weak" ? " (check before approving)" : ""}</span>
    </Chip>
  );
};

export const Spinner = ({ label = "Loading..." }: { label?: string }) => (
  <p role="status" className="py-10 text-center text-sm text-slate-600 dark:text-slate-400">
    {label}
  </p>
);
