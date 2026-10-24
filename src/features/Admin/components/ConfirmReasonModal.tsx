import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { dangerButton, ErrorBanner, inputClasses, secondaryButton } from "./AdminUi";

export const MAX_REASON_LENGTH = 500;

interface ConfirmReasonModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

/** Modal that asks for an optional rejection reason (max 500 characters). */
const ConfirmReasonModal = ({
  title,
  description,
  confirmLabel,
  isSubmitting,
  error,
  onConfirm,
  onCancel,
}: ConfirmReasonModalProps) => {
  const [reason, setReason] = useState("");
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the heading, not the textarea: on phones that would pop the keyboard
    // open and cover the buttons before the admin has read the question.
    headingRef.current?.focus();

    // Lock the page behind the dialog while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      // The opener may be gone or disabled by now (e.g. the bulk-reject button once
      // the selection is cleared): fall back to the page heading.
      const usable =
        previouslyFocused &&
        previouslyFocused.isConnected &&
        !(previouslyFocused as HTMLButtonElement).disabled;
      if (usable) {
        previouslyFocused.focus();
        return;
      }
      const heading = document.querySelector<HTMLElement>("main h1");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel();
        return;
      }

      // Keep Tab focus inside the dialog.
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), textarea:not([disabled])")
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        // The heading (initial focus) is not tabbable, so Shift+Tab from it must wrap too.
        const outsideTabOrder = !(active instanceof HTMLElement) || !focusable.includes(active);
        if (event.shiftKey && (active === first || outsideTabOrder)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSubmitting, onCancel]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2
              id={titleId}
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-bold text-slate-900 focus:outline-none dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
          </div>

          <div>
            <label htmlFor={`${titleId}-reason`} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Reason (optional)
            </label>
            <textarea
              id={`${titleId}-reason`}
              autoComplete="off"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={MAX_REASON_LENGTH}
              rows={4}
              className={inputClasses}
            />
            <p className="mt-1 text-right text-xs text-slate-600 dark:text-slate-400">
              {reason.length}/{MAX_REASON_LENGTH}
            </p>
          </div>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className={secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={dangerButton}>
              {isSubmitting ? "Working..." : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmReasonModal;
