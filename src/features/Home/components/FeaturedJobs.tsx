import { Link, useNavigate } from "react-router-dom";
import JobCard from "../../../components/ui/JobCard";
import { ArrowRight } from "lucide-react";
import JobCardSkeleton from "../../../components/ui/JobCardSkeleton";
import SlowLoadNotice from "../../../components/ui/SlowLoadNotice";
import { useFeaturedJobs } from "../../../hooks/useFeaturedJobs";

// Same frame for real and placeholder cards, so nothing shifts on load.
const cardFrame = "shadow-sm border border-slate-200 dark:border-slate-700";
const gridClass = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

const FeaturedJobs = () => {
  const { jobs: featuredJobs, isLoading, error, retry, toggleSave } = useFeaturedJobs();
  const navigate = useNavigate();

  const handleFeaturedJobClick = (jobId: string) => {
    if (window.innerWidth < 768) {
      navigate(`/jobs/${jobId}`);
      return;
    }

    navigate(`/jobs?selected=${jobId}`);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center justify-between md:hidden">
            <h2 className="font-medium text-blue-600">Featured Jobs</h2>
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden md:flex items-end justify-between">
            <div>
              <p className="font-medium text-blue-600">Featured Jobs</p>
              <p className="mt-2 text-xl sm:text-2xl lg:text-4xl font-bold dark:text-white">
                Find your next opportunity
              </p>
              <p className="mt-4 max-w-xl text-slate-500 dark:text-slate-400">
                Discover verified openings from top employers hiring now.
              </p>
            </div>
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 md:hidden">
            <p className="text-xl sm:text-2xl lg:text-4xl font-bold dark:text-white">
              Find your next opportunity
            </p>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Discover verified openings from top employers hiring now.
            </p>
          </div>
        </div>

        {isLoading ? (
          <>
            <div className={gridClass} aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <JobCardSkeleton key={i} className={cardFrame} />
              ))}
            </div>
            {/* Outside the aria-busy grid so its message is announced. */}
            <SlowLoadNotice className="mt-6 text-center" />
          </>
        ) : error ? (
          <div role="alert" className="py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <button
              onClick={retry}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className={gridClass}>
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => handleFeaturedJobClick(job.id)}
                onToggleSave={() => toggleSave(job.id)}
                className={`${cardFrame} transition hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
