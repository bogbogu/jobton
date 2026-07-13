import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type PopularCategoriesCardProps = {
  icon: LucideIcon;
  title: string;
  jobs: string;
};

const PopularCategoriesCard = ({
  icon: Icon,
  title,
  jobs,
}: PopularCategoriesCardProps) => {
  return (
    <Link
      className="
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-800
        p-6
        transition-all
        duration-300
        hover:border-blue-200
        dark:hover:border-blue-500
        hover:shadow-lg
      "
      to="/categories"
    >
      <div className="mb-5 text-[#2563EB]">
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {jobs}
      </p>
    </Link>
  );
};

export default PopularCategoriesCard;