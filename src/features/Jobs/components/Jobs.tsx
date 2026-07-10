import { useState } from "react";
import JobCard from "../../../components/ui/JobCard";
import JobDetail from "./JobDetail";
import { useJobs, type Job } from "../../../hooks/useJobs";

const Jobs = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-slate-500 mb-6">
          Showing 1–{jobs.length} of {jobs.length} results
        </p>

        <div className="flex gap-6 items-start">
          {/* Left — scrollable job list */}
          <div className="w-full md:w-5/12 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer rounded-3xl transition ring-2 ${
                  selectedJob?.id === job.id
                    ? "ring-blue-500"
                    : "ring-transparent hover:ring-slate-200"
                }`}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Right — sticky detail, tablet and above only */}
          <div className="hidden md:block md:w-7/12 sticky top-24 self-start">
            {selectedJob && <JobDetail job={selectedJob} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jobs;