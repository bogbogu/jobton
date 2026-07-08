import { Link } from "react-router-dom";
import JobCard from "../ui/JobCard";
import { ArrowRight } from "lucide-react";
import googleLogo from "../../assets/images/logos/google.png";
import metaLogo from "../../assets/images/logos/meta.png";
import flutterwaveLogo from "../../assets/images/logos/flutterwave.png";
import microsoftLogo from "../../assets/images/logos/microsoft.png";

const jobs = [
  {
    company: "Google",
    logo: googleLogo,
    title: "Senior Product Designer",
    location: "Remote",
    type: "Full-time",
    salary: "$8k - $10k",
    tags: ["UI/UX", "Figma"],
  },
  {
    company: "Meta",
    logo: metaLogo,
    title: "Frontend Engineer",
    location: "Lagos",
    type: "Hybrid",
    salary: "₦900k",
    tags: ["React", "TypeScript"],
  },
  {
    company: "Flutterwave",
    logo: flutterwaveLogo,
    title: "Backend Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "₦1.2m",
    tags: ["Node", "Postgres"],
  },
  {
    company: "Microsoft",
    logo: microsoftLogo,
    title: "Cloud Engineer",
    location: "Abuja",
    type: "Remote",
    salary: "$7k",
    tags: ["Azure", "DevOps"],
  },
];

const FeaturedJobs = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="font-medium text-blue-600">Featured Jobs</p>

            <h2 className="mt-2 text-4xl font-bold">
              Find your next opportunity
            </h2>

            <p className="mt-4 max-w-xl text-slate-500">
              Discover verified openings from top employers hiring now.
            </p>
          </div>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.title} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
