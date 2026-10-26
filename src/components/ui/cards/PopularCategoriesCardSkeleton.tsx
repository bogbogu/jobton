import { Skeleton } from "../Skeleton";

// Placeholder with the same box as PopularCategoriesCard.
const PopularCategoriesCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
    <Skeleton className="mb-5 h-7 w-7" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
  </div>
);

export default PopularCategoriesCardSkeleton;
