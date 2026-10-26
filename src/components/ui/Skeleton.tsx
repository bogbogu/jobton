// A single grey placeholder shape. Purely decorative, so it is hidden from
// assistive tech — whatever renders a group of these should mark its
// container aria-busy and announce the loading through a live region that
// stays mounted (text that appears together with its own container is
// usually not read out). The pulse is skipped for people who prefer reduced
// motion.
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`block rounded-md bg-slate-200 dark:bg-slate-700 motion-safe:animate-pulse ${className}`}
  />
);
