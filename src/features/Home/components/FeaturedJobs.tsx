import { Link, useNavigate } from "react-router-dom";
import JobCard from "../../../components/ui/JobCard";
import { ArrowRight } from "lucide-react";
import { useJobs } from "../../../hooks/useJobs";

const FeaturedJobs = () => {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const featuredJobs = jobs.slice(0, 6);

  const handleFeaturedJobClick = (jobId: number) => {
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleFeaturedJobClick(job.id)}
              className="shadow-sm transition hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
