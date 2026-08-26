import { mainFetch } from "../api/mainFetch";
import { mainPost } from "../api/mainPost";
import { mainDelete } from "../api/mainDelete";
import type { Job } from "../types/job-type";

export interface JobsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface JobsListResponse {
  message: string;
  jobs: Job[];
  pagination: JobsPagination;
}

interface JobDetailResponse {
  message: string;
  job: Job;
}

export interface JobsListParams {
  page?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  type?: string;
  industry?: string;
  category?: string;
  company?: string;
  sort?: string;
}

interface SaveJobResponse {
  message: string;
  saved: boolean;
}

export const jobsService = {
  list: async (params?: JobsListParams) => {
    return mainFetch<JobsListResponse>(
      "/api/jobs",
      { params },
      "Unable to load jobs."
    );
  },

  getById: async (id: string) => {
    return mainFetch<JobDetailResponse>(
      `/api/jobs/${id}`,
      undefined,
      "Unable to load this job."
    );
  },

  listSaved: async (params?: { page?: number; limit?: number }) => {
    return mainFetch<JobsListResponse>(
      "/api/jobs/saved",
      { params },
      "Unable to load your saved jobs."
    );
  },

  save: async (id: string) => {
    return mainPost<SaveJobResponse>(
      `/api/jobs/${id}/save`,
      undefined,
      undefined,
      "Unable to save this job."
    );
  },

  unsave: async (id: string) => {
    return mainDelete<SaveJobResponse>(
      `/api/jobs/${id}/save`,
      undefined,
      "Unable to unsave this job."
    );
  },
};
