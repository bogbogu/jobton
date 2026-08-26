import { useEffect, useState } from "react";
import type { Job } from "../types/job-type";
import { jobsService } from "../services/jobs.service";
import { useSaveJobToggle } from "./useSaveJobToggle";

const PAGE_SIZE = 50; // matches the backend's max page size

// The Jobs page filters/sorts entirely client-side today (see
// useJobsPageService.ts), so this hook loads the full job list up front
// rather than exposing server-side pagination — fetching every page keeps
// that existing behavior intact instead of only ever showing the first 50.
const fetchAllJobs = async (): Promise<Job[]> => {
  let page = 1;
  let all: Job[] = [];

  while (true) {
    const { jobs, pagination } = await jobsService.list({ page, limit: PAGE_SIZE });
    all = all.concat(jobs);

    if (page >= pagination.totalPages) break;
    page += 1;
  }

  return all;
};

export const useJobs = () => {
  const saveToggle = useSaveJobToggle();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    fetchAllJobs()
      .then((allJobs) => {
        if (isActive) setJobs(allJobs);
      })
      .catch((err) => {
        if (isActive) setError(err instanceof Error ? err.message : "Unable to load jobs.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const toggleSave = async (jobId: string) => {
    const target = jobs.find((job) => job.id === jobId);
    if (!target) return;

    const nextSaved = await saveToggle(jobId, target.saved ?? false);
    if (nextSaved === null) return; // redirected to log in — nothing to update

    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, saved: nextSaved } : job)));
  };

  return { jobs, isLoading, error, toggleSave };
};
