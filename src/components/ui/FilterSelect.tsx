import { ChevronDown, X } from "lucide-react";

interface FilterOption {
  key: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholderLabel: string;
  options: FilterOption[];
  selectClassName: string;
  clearAriaLabel: string;
  fullWidth?: boolean;
}

// A native <select> with a small "x" that appears next to the arrow once a
// value is chosen, so clearing one filter doesn't require opening the
// dropdown and scrolling back to the placeholder option.
const FilterSelect = ({
  value,
  onChange,
  placeholderLabel,
  options,
  selectClassName,
  clearAriaLabel,
  fullWidth = false,
}: FilterSelectProps) => {
  const isActive = !!value;

  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none ${isActive ? "pr-14" : "pr-8"} ${selectClassName}`}
      >
        <option value="">{placeholderLabel}</option>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>

      {isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          aria-label={clearAriaLabel}
          className="absolute right-7 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
        >
          <X size={13} />
        </button>
      )}

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
};

export default FilterSelect;
