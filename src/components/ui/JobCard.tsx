import { MapPin, BriefcaseBusiness, Bookmark } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  featured: "bg-amber-100 text-amber-700",
  verified: "bg-green-100 text-green-700",
  urgent: "bg-red-100 text-red-700",
};

const JobCard = ({ job }: any) => {
  const [saved, setSaved] = useState(job.saved ?? false);
  return (
    <div className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={job.logo}
            alt={job.company}
            className="h-14 w-14 rounded-xl object-contain"
          />

          <div>
            <p className="font-bold text-base">{job.title}</p>
            <p className="text-slate-500">{job.company}</p>
          </div>
        </div>

        <button
          onClick={() => setSaved(!saved)}
          className="rounded-full p-2 transition hover:bg-slate-100"
        >
          <Bookmark
            size={20}
            className={`transition ${
              saved
                ? "fill-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          />
        </button>
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
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          {job.location}
        </span>

        <span className="flex items-center gap-2">
          <BriefcaseBusiness size={16} />
          {job.type}
        </span>
      </div>

      <p className="mt-4 text-[14px] font-semibold text-slate-900">{job.salary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((skill: string) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">Posted {job.posted}</p>
    </div>
  );
};

export default JobCard;
