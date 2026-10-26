import { Skeleton } from "../../../components/ui/Skeleton";

// Same outer shape as JobCard so the list does not jump when jobs arrive.
const JobCardSkeleton = () => (
  <div className="rounded-3xl bg-white dark:bg-slate-800 p-7 ring-2 ring-transparent">
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

export const JobListSkeleton = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <JobCardSkeleton key={i} />
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
