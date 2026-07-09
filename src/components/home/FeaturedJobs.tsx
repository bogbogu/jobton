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
    salary: "$8k - $10k / month",
    status: ["featured", "verified"],
    skills: ["UI/UX", "Figma"],
    posted: "2 days ago",
  },
  {
    company: "Meta",
    logo: metaLogo,
    title: "Frontend Engineer",
    location: "Lagos",
    type: "Hybrid",
    salary: "₦900k / month",
    status: ["urgent"],
    skills: ["React", "TypeScript"],
    posted: "1 day ago",
  },
  {
    company: "Flutterwave",
    logo: flutterwaveLogo,
    title: "Backend Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "₦1.2m / month",
    status: ["verified"],
    skills: ["Node.js", "Postgres"],
    posted: "5 hours ago",
  },
  {
    company: "Microsoft",
    logo: microsoftLogo,
    title: "Cloud Engineer",
    location: "Abuja",
    type: "Remote",
    salary: "$7k / month",
    status: ["featured"],
    skills: ["Azure", "DevOps"],
    posted: "3 days ago",
  },
];

const FeaturedJobs = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center justify-between md:hidden">
            <p className="font-medium text-blue-600">Featured Jobs</p>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden md:flex items-end justify-between">
            <div>
              <p className="font-medium text-blue-600">Featured Jobs</p>
              <p className="mt-2 text-4xl font-bold">
                Find your next opportunity
              </p>
              <p className="mt-4 max-w-xl text-slate-500">
                Discover verified openings from top employers hiring now.
              </p>
            </div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 md:hidden">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-bold">
              Find your next opportunity
            </p>
            <p className="mt-4 text-slate-500">
              Discover verified openings from top employers hiring now.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.title} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
