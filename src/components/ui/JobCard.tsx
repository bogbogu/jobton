import { MapPin, BriefcaseBusiness, Bookmark, ThumbsDown } from "lucide-react";
import CompanyLogo from "../CompanyLogo";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  featured: "bg-amber-100 text-amber-700",
  verified: "bg-green-100 text-green-700",
  urgent: "bg-red-100 text-red-700",
};

const JobCard = ({ job, onClick, className }: { job: any; onClick?: () => void; className?: string }) => {
  const [saved, setSaved] = useState(job.saved ?? false);
  const [reported, setReported] = useState(false);
  return (
    <div onClick={onClick} className={`rounded-3xl bg-white dark:bg-slate-800 p-7 cursor-pointer ${className ?? ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <CompanyLogo
            key={job.id}
            company={job.company}
            domain={job.domain}
            logoUrl={job.logo_url}
          />

          <div>
            <p className="font-bold text-base dark:text-white">{job.title}</p>
            <p className="text-slate-500 dark:text-slate-400">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Bookmark
              size={20}
              className={`transition ${saved
                ? "fill-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
                }`}
            />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setReported(!reported); }}
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ThumbsDown
              size={20}
              className={`transition ${reported
                ? "fill-red-500 text-red-500"
                : "text-slate-500 hover:text-slate-700"
                }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.status.map((item: string) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[item]}`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
        <span className="flex items-center gap-2 dark:text-slate-400">
          <MapPin size={16} />
          {job.location}
        </span>

        <span className="flex items-center gap-2 dark:text-slate-400">
          <BriefcaseBusiness size={16} />
          {job.type}
        </span>
      </div>

      <p className="mt-4 text-[14px] font-semibold text-slate-900 dark:text-white">{job.salary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((skill: string) => (
          <span
            key={skill}
            className={`rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs text-slate-700 dark:text-slate-300`}
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Posted {job.posted}</p>
    </div>
  );
};

export default JobCard;
