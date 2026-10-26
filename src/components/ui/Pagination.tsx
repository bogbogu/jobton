import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PaginationItem = { kind: "page"; page: number } | { kind: "gap"; key: string };

// Always shows the first page, the last page and the current page ±1, with
// an ellipsis for any run of skipped pages (a single skipped page is just
// shown instead — an ellipsis for one number would save nothing).
const buildItems = (current: number, total: number): PaginationItem[] => {
  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];
  let previous = 0;
  for (const n of wanted) {
    if (n - previous === 2) items.push({ kind: "page", page: previous + 1 });
    else if (n - previous > 2) items.push({ kind: "gap", key: `gap-${n}` });
    items.push({ kind: "page", page: n });
    previous = n;
  }
  return items;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
// 44px tap targets on touch screens, a bit tighter on larger ones.
const buttonSize = "min-h-11 min-w-11 md:min-h-9 md:min-w-9";

const Pagination = ({ page, totalPages, onPageChange, className = "" }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const arrowClass = `inline-flex ${buttonSize} items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-600 px-2 md:px-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-white dark:aria-disabled:hover:bg-slate-800 ${focusRing}`;

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => current > 1 && onPageChange(current - 1)}
            aria-disabled={current <= 1}
            className={arrowClass}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </button>
        </li>

        {buildItems(current, totalPages).map((item) =>
          item.kind === "gap" ? (
            <li key={item.key} aria-hidden="true" className="px-1 text-slate-400 select-none">
              …
            </li>
          ) : (
            <li key={item.page}>
              <button
                type="button"
                onClick={() => onPageChange(item.page)}
                aria-current={item.page === current ? "page" : undefined}
                className={`inline-flex ${buttonSize} items-center justify-center rounded-xl border px-2 text-sm transition ${focusRing} ${
                  item.page === current
                    ? "border-blue-600 bg-blue-600 font-semibold text-white"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <span className="sr-only">Page </span>
                {item.page}
              </button>
            </li>
          )
        )}

        <li>
          <button
            type="button"
            onClick={() => current < totalPages && onPageChange(current + 1)}
            aria-disabled={current >= totalPages}
            className={arrowClass}
          >
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
