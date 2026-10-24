import { useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Check, Mail, Phone, MessageCircle, ExternalLink } from "lucide-react";
import type { Job } from "../types/job-type";
import {
  isSafeEmail,
  normalizePhone,
  safeHttpUrl,
  safeMailtoHref,
  safeTelHref,
  safeWhatsAppHref,
} from "../utils/jobDisplay";

type CopyState = "idle" | "copied" | "failed";

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  try {
    area.value = text;
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "-9999px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    // Always remove the helper element and give focus back to where it was.
    area.parentNode?.removeChild(area);
    previouslyFocused?.focus?.();
  }
};

const BTN_BASE =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
  "dark:focus-visible:ring-offset-slate-800";
const BTN_SECONDARY =
  `${BTN_BASE} border border-slate-300 text-slate-700 hover:bg-slate-100 ` +
  "dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700";
const BTN_PRIMARY = `${BTN_BASE} bg-blue-600 text-white hover:bg-blue-700`;
const BTN_WHATSAPP = `${BTN_BASE} bg-green-700 text-white hover:bg-green-800`;

interface ContactRowProps {
  label: string; // "email address" | "phone number" – used in aria-labels
  value: string;
  children: ReactNode; // action buttons
}

const ContactRow = ({ label, value, children }: ContactRowProps) => {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), ok ? 2000 : 4000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <p className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400">{label}</p>
      <p className="mt-1 select-all break-all text-base font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className={BTN_SECONDARY}
        >
          {state === "copied" ? <Check size={16} /> : <Copy size={16} />}
          {state === "copied" ? "Copied" : state === "failed" ? "Press and hold to copy" : "Copy"}
        </button>
        {children}
      </div>
      <span className="sr-only" aria-live="polite" role="status">
        {state === "copied"
          ? `${label} copied to clipboard`
          : state === "failed"
            ? `Could not copy automatically. Press and hold the ${label} to copy it.`
            : ""}
      </span>
    </div>
  );
};

const ApplyContacts = ({ job }: { job: Job }) => {
  const link = safeHttpUrl(job.applicationLink);
  // Only values that pass validation are shown at all; the phone is shown (and
  // copied) in its normalized form, e.g. 0801 234 5678 -> +2348012345678.
  const email = isSafeEmail(job.applyEmail) ? (job.applyEmail?.trim() ?? null) : null;
  const phone = normalizePhone(job.applyPhone);

  const mailto = safeMailtoHref(email);
  const tel = safeTelHref(phone);
  const whatsapp = safeWhatsAppHref(phone);

  const hasAny = !!link || !!email || !!phone;

  return (
    <section aria-labelledby={`how-to-apply-${job.id}`} className="mt-5">
      <h3
        id={`how-to-apply-${job.id}`}
        className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400"
      >
        How to apply
      </h3>

      {!hasAny && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Application details were not provided for this job.
        </p>
      )}

      <div className="mt-3 space-y-3">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} px-6 py-3`}
          >
            Apply Now <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}

        {email && (
          <ContactRow label="email address" value={email}>
            {mailto && (
              <a href={mailto} aria-label="Send an email to apply" className={BTN_PRIMARY}>
                <Mail size={16} aria-hidden="true" />
                Email
              </a>
            )}
          </ContactRow>
        )}

        {phone && (
          <ContactRow label="phone number" value={phone}>
            {tel && (
              <a href={tel} aria-label="Call this phone number" className={BTN_PRIMARY}>
                <Phone size={16} aria-hidden="true" />
                Call
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message on WhatsApp"
                className={BTN_WHATSAPP}
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            )}
          </ContactRow>
        )}
      </div>
    </section>
  );
};

export default ApplyContacts;
