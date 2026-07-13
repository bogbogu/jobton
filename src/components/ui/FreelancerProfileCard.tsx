import { BriefcaseBusiness, MapPin, Phone, Star } from "lucide-react";
import type { FreelancerProfile } from "../../types/freelancer";

type FreelancerProfileCardProps = {
  freelancer: FreelancerProfile;
  isActive: boolean;
  onSelect: () => void;
};

const FreelancerProfileCard = ({ freelancer, isActive, onSelect }: FreelancerProfileCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
        isActive
          ? "border-blue-500 bg-blue-50/70 dark:bg-blue-900/20 shadow-sm"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-white">{freelancer.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{freelancer.role}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Star size={12} className="text-amber-500" />
          {freelancer.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-slate-600 dark:text-slate-300">
          <MapPin size={12} />
          {freelancer.location}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-slate-600 dark:text-slate-300">
          <BriefcaseBusiness size={12} />
          {freelancer.hourlyRate}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{freelancer.bio}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-blue-600">{freelancer.availability}</span>
        <a
          href={`tel:${freelancer.phone}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
        >
          <Phone size={13} />
          Reach out
        </a>
      </div>
    </button>
  );
};

export default FreelancerProfileCard;
