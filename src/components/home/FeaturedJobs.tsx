import { Link } from "react-router-dom";
import JobCard from "../ui/JobCard";

const jobs = [
    {
        company: "Google",
        logo: "/assets/images/logos/google.png",
        title: "Senior Product Designer",
        location: "Remote",
        type: "Full-time",
        salary: "$8k - $10k",
        tags: ["UI/UX", "Figma"],
    },
    {
        company: "Meta",
        logo: "/assets/images/logos/meta.png",
        title: "Frontend Engineer",
        location: "Lagos",
        type: "Hybrid",
        salary: "₦900k",
        tags: ["React", "TypeScript"],
    },
    {
        company: "Flutterwave",
        logo: "/assets/images/logos/flutterwave.png",
        title: "Backend Engineer",
        location: "Remote",
        type: "Full-time",
        salary: "₦1.2m",
        tags: ["Node", "Postgres"],
    },
    {
        company: "Microsoft",
        logo: "/assets/images/logos/microsoft.png",
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
                        <p className="font-medium text-blue-600">
                            Featured Jobs
                        </p>

                        <h2 className="mt-2 text-4xl font-bold">Find your next opportunity
                        </h2>

                        <p className="mt-4 max-w-xl text-slate-500">
                            Discover verified openings from top employers hiring now.
                        </p>
                    </div>
                    {/* <Link to="/all" className="rounded-lg border px-6 py-3 hover:bg-white">
                        View All
                    </Link> */}
                    <Link to="/" className="font-medium text-blue-600">
                            View all
                    </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
                    {jobs.map(job => (
                        <JobCard key={job.title} job={job} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedJobs;