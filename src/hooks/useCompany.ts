import { useEffect, useState } from "react";
import type { Company } from "../types/company-type";
import type { Job } from "../types/job-type";
import { companiesService } from "../services/companies.service";
import { jobsService } from "../services/jobs.service";
import { useSaveJobToggle } from "./useSaveJobToggle";

// A company's job listings are fetched separately (GET /api/jobs?company=)
// rather than embedded in the company response — Job doesn't hold a
// companyId, only a plain `company` name string (see the backend README's
// Companies section for why), so this is two requests, not a join.
export const useCompany = (slug: string | undefined) => {
  const saveToggle = useSaveJobToggle();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    companiesService
      .getBySlug(slug)
      .then(async ({ company: fetchedCompany }) => {
        if (!isActive) return;
        setCompany(fetchedCompany);

        const { jobs: companyJobs } = await jobsService.list({
          company: fetchedCompany.name,
          limit: 50,
        });
        if (isActive) setJobs(companyJobs);
      })
      .catch((err) => {
        if (isActive) setError(err instanceof Error ? err.message : "Unable to load this company.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const toggleSave = async (jobId: string) => {
    const target = jobs.find((job) => job.id === jobId);
    if (!target) return;

    const nextSaved = await saveToggle(jobId, target.saved ?? false);
    if (nextSaved === null) return;

    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, saved: nextSaved } : job)));
  };

  return { company, jobs, isLoading, error, toggleSave };
};
