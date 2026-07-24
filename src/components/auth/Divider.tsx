interface DividerProps {
  label?: string;
}

const Divider = ({ label = "or" }: DividerProps) => {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
};

export default Divider;
