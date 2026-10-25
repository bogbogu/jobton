import { useEffect, useId, useRef, type ReactNode } from "react";
import { ErrorBanner, primaryButton, secondaryButton } from "./AdminUi";

interface ConfirmActionModalProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Plain confirmation dialog (no input). Initial focus goes to the heading, Tab stays
 * inside, Escape cancels, and nothing runs until the confirm button is pressed.
 */
const ConfirmActionModal = ({
  title,
  children,
  confirmLabel,
  isSubmitting,
  error,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    headingRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

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

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])")
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
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

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <div className="space-y-4">
          <div>
            <h2
              id={titleId}
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-bold text-slate-900 focus:outline-none dark:text-white"
            >
              {title}
            </h2>
            <div className="mt-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">{children}</div>
          </div>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className={secondaryButton}>
              Cancel
            </button>
            <button type="button" onClick={onConfirm} disabled={isSubmitting} className={primaryButton}>
              {isSubmitting ? "Working..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
