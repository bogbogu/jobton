import { Skeleton } from "./Skeleton";

// Same outer shape as JobCard so the layout does not jump when jobs arrive.
// `className` carries whatever frame the page gives its real cards.
const JobCardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-3xl bg-white dark:bg-slate-800 p-7 ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3.5 w-1/3" />
      </div>
    </div>
    <div className="mt-5 flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="mt-5 flex gap-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="mt-4 h-4 w-32" />
    <div className="mt-5 flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
    <Skeleton className="mt-6 h-3.5 w-24" />
  </div>
);

export default JobCardSkeleton;
