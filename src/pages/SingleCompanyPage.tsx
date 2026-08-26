import { useParams, useNavigate, Link } from "react-router-dom";
import { Globe, MapPin, Briefcase } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";
import CompanyLogo from "../components/CompanyLogo";
import JobCard from "../components/ui/JobCard";
import { useCompany } from "../hooks/useCompany";

const SingleCompanyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { company, jobs, isLoading, error, toggleSave } = useCompany(slug);

  if (!company) {
    return (
      <section className="py-8 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            {isLoading ? "Loading company..." : error ? error : "Company not found."}
          </p>
          {!isLoading && (
            <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              Back to Jobs
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <PageBanner pageTitle={company.name} pageSubTitle={company.industry || undefined} />

      <section className="py-10 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-start gap-4">
              <CompanyLogo company={company.name} domain={company.domain} logoUrl={company.logo_url} />
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{company.name}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {company.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />
                      {company.location}
                    </span>
                  )}
                  {company.industry && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={15} />
                      {company.industry}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-blue-600 transition"
                    >
                      <Globe size={15} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {company.description && (
              <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {company.description}
              </p>
            )}
          </div>

          <h3 className="text-lg font-bold mb-4 dark:text-white">
            Open roles at {company.name}
          </h3>

          {jobs.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No open roles listed for {company.name} right now.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleSave={() => toggleSave(job.id)}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SingleCompanyPage;
