import { useEffect, useState } from "react";
import type { Job } from "../types/job-type";
import { jobsService } from "../services/jobs.service";
import { useSaveJobToggle } from "./useSaveJobToggle";

const FEATURED_COUNT = 6;

// The newest few jobs for the home page. Asks the API for just that many
// (it returns newest first) instead of downloading every job like useJobs.
export const useFeaturedJobs = () => {
  const saveToggle = useSaveJobToggle();
  const [attempt, setAttempt] = useState(0);
  // The outcome of one attempt; loading is simply "no outcome for this attempt yet".
  const [outcome, setOutcome] = useState<{ attempt: number; jobs: Job[]; error: string | null } | null>(null);

  useEffect(() => {
    let isActive = true;

    jobsService
      .list({ page: 1, limit: FEATURED_COUNT })
      .then(({ jobs }) => {
        if (isActive) setOutcome({ attempt, jobs, error: null });
      })
      .catch((err) => {
        if (isActive) {
          setOutcome({ attempt, jobs: [], error: err instanceof Error ? err.message : "Unable to load jobs." });
        }
      });

    return () => {
      isActive = false;
    };
  }, [attempt]);

  const current = outcome && outcome.attempt === attempt ? outcome : null;

  const retry = () => setAttempt((count) => count + 1);

  const toggleSave = async (jobId: string) => {
    const target = current?.jobs.find((job) => job.id === jobId);
    if (!target) return;

    try {
      // Also updates the Find Jobs page's cached pages.
      const nextSaved = await saveToggle(jobId, target.saved ?? false);
      if (nextSaved === null) return; // redirected to log in — nothing to update

      setOutcome((prev) =>
        prev && prev.attempt === attempt
          ? { ...prev, jobs: prev.jobs.map((job) => (job.id === jobId ? { ...job, saved: nextSaved } : job)) }
          : prev
      );
    } catch {
      // A failed save leaves the card as it was.
    }
  };

  return {
    jobs: current?.jobs ?? [],
    isLoading: current === null,
    error: current?.error ?? null,
    retry,
    toggleSave,
  };
};
