import {
  AtSign,
  BriefcaseBusiness,
  CircleUserRound,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import type { ComponentType } from "react";
import type { FreelancerHandlePlatform, FreelancerProfile } from "../../../types/freelancer";

type FreelancerDetailsPanelProps = {
  freelancer: FreelancerProfile | null;
};

const platformIcon: Record<FreelancerHandlePlatform, ComponentType<{ size?: number }>> = {
  LinkedIn: BriefcaseBusiness,
  X: CircleUserRound,
  Instagram: AtSign,
  Portfolio: Globe,
  WhatsApp: MessageCircle,
};

const FreelancerDetailsPanel = ({ freelancer }: FreelancerDetailsPanelProps) => {
  if (!freelancer) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 p-8 text-center text-slate-500 dark:text-slate-400">
        No freelancer found for this filter. Try another search.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 md:p-7 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{freelancer.name}</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{freelancer.role}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs font-semibold">
          <Star size={12} /> {freelancer.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:text-sm">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5">
          <MapPin size={14} />
          {freelancer.location}
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5">
          <BriefcaseBusiness size={14} />
          {freelancer.hourlyRate}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{freelancer.yearsExperience}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Years</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{freelancer.projectsCompleted}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Projects</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-sm font-semibold text-blue-600">{freelancer.availability}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{freelancer.bio}</p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {freelancer.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-2">
        <a
          href={`mailto:${freelancer.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 transition"
        >
          <Mail size={15} />
          Email freelancer
        </a>
        <a
          href={`tel:${freelancer.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-200 text-sm font-semibold py-2.5 transition"
        >
          <Phone size={15} />
          Call {freelancer.phone}
        </a>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Social handles</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {freelancer.handles.map((handle) => {
            const Icon = platformIcon[handle.platform];
            return (
              <a
                key={`${freelancer.id}-${handle.platform}`}
                href={handle.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition"
              >
                <Icon size={13} />
                {handle.platform}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetailsPanel;
