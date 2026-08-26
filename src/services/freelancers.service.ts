import { mainFetch } from "../api/mainFetch";
import type { FreelancerProfile } from "../types/freelancer-type";

export interface FreelancersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FreelancersListResponse {
  message: string;
  freelancers: FreelancerProfile[];
  pagination: FreelancersPagination;
}

export const freelancersService = {
  // /api/freelancers requires auth on every route (see the backend README) —
  // the request goes through mainFetch's privateAccess client, which already
  // attaches the Bearer token via the axios interceptor, so nothing extra is
  // needed here as long as the caller is signed in (this page is behind
  // ProtectedRoute, so it always is).
  list: async (params?: { page?: number; limit?: number }) => {
    return mainFetch<FreelancersListResponse>(
      "/api/freelancers",
      { params },
      "Unable to load freelancers."
    );
  },
};
