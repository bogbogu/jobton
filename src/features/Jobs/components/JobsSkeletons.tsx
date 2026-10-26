import { Skeleton } from "../../../components/ui/Skeleton";
import JobCardSkeleton from "../../../components/ui/JobCardSkeleton";

export const JobListSkeleton = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <JobCardSkeleton key={i} className="ring-2 ring-transparent" />
    ))}
  </>
);

export const JobDetailSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-7 w-3/4" />
      </div>
    </div>
    <div className="mt-5 flex gap-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="mt-6 h-11 w-36 rounded-xl" />
    <div className="mt-8 flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-7 space-y-2.5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);
