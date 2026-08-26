import { useEffect, useState } from "react";
import type { FreelancerProfile } from "../types/freelancer-type";
import { freelancersService } from "../services/freelancers.service";

const PAGE_SIZE = 50; // matches the backend's max page size

// Mirrors useJobs.ts: the freelancer directory is filtered/browsed
// client-side, so load the full list up front rather than exposing
// server-side pagination in the UI.
const fetchAllFreelancers = async (): Promise<FreelancerProfile[]> => {
  let page = 1;
  let all: FreelancerProfile[] = [];

  while (true) {
    const { freelancers, pagination } = await freelancersService.list({ page, limit: PAGE_SIZE });
    all = all.concat(freelancers);

    if (page >= pagination.totalPages) break;
    page += 1;
  }

  return all;
};

export const useFreelancers = () => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    fetchAllFreelancers()
      .then((all) => {
        if (isActive) setFreelancers(all);
      })
      .catch((err) => {
        if (isActive) setError(err instanceof Error ? err.message : "Unable to load freelancers.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { freelancers, isLoading, error };
};
