import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2, Flag } from "lucide-react";
import { useJobs } from "../hooks/useJobs";
import JobDetail from "../features/Jobs/components/JobDetail";
import JobCard from "../components/ui/JobCard";

const SingleJobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useJobs();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === Number(id));

  const relatedJobs = job
    ? jobs.filter(
        (j) =>
          j.id !== job.id &&
          (j.industry === job.industry ||
            j.skills.some((s) => job.skills.includes(s)))
      )
    : [];

  const [selectedJob, setSelectedJob] = useState(job ?? null);
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/${id}`;
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500">
        <p className="text-lg font-medium">Job not found.</p>
        <button onClick={() => navigate("/jobs")} className="text-blue-600 hover:underline text-sm">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <section className="py-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header row — back + actions */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Jobs</span>
          </button>

          {/* Save / Share / Report icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${saved ? "text-blue-600" : "text-slate-400"}`}
              title="Save"
            >
              <Bookmark size={20} className={saved ? "fill-blue-600" : ""} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 relative"
              title={shareToast ? "Copied!" : "Share"}
            >
              <Share2 size={20} />
              {shareToast && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={() => !reported && setReported(true)}
              className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${reported ? "text-red-400 cursor-default" : "text-slate-400 hover:text-red-500"}`}
              title={reported ? "Reported" : "Report"}
            >
              <Flag size={20} className={reported ? "fill-red-400" : ""} />
            </button>
          </div>
        </div>

        {/* Mobile: job detail only */}
        <div className="md:hidden">
          <JobDetail job={job} />
        </div>

        {/* Desktop: split panel */}
        <div className="hidden md:flex gap-6 items-start">
          <div className="w-5/12 flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Related Jobs</p>
            {relatedJobs.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No related jobs found.</p>
            ) : (
              relatedJobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJob(j)}
                  className={`cursor-pointer rounded-3xl transition ring-2 ${
                    selectedJob?.id === j.id ? "ring-blue-500" : "ring-transparent hover:ring-slate-200"
                  }`}
                >
                  <JobCard job={j} />
                </div>
              ))
            )}
          </div>
          <div className="w-7/12 sticky top-24 self-start">
            {selectedJob && <JobDetail job={selectedJob} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleJobDetailPage;
