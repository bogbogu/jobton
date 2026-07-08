import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";

const JobCard = ({ job }: any) => {
  return (
    <div className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <img
            src={job.logo}
            className="h-14 w-14 rounded-xl object-contain"
          />

          <div>
            <h3 className="font-bold">
              {job.title}
            </h3>

            <p className="text-slate-500">
              {job.company}
            </p>
          </div>

        </div>

        <button className="rounded-full bg-blue-50 px-4 py-2 text-[12px] text-blue-600">
          {job.salary}
        </button>

      </div>

      <div className="mt-8 flex gap-6 text-sm text-slate-500">

        <span className="flex items-center gap-2">
          <MapPin size={16} />
          {job.location}
        </span>

        <span className="flex items-center gap-2">
          <BriefcaseBusiness size={16} />
          {job.type}
        </span>

        <span className="flex items-center gap-2">
          <Clock3 size={16} />
          Apply now
        </span>

      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {job.tags.map((tag: string) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

    </div>
  );
};

export default JobCard;