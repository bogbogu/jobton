import type { LucideIcon } from "lucide-react";

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
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        transition-all
        duration-300
        hover:border-blue-200
        hover:shadow-lg
      "
    >
      <div className="mb-5 text-[#2563EB]">
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {jobs}
      </p>
    </div>
  );
};

export default PopularCategoriesCard;