import { mainFetch } from "../api/mainFetch";
import type { Company } from "../types/company-type";

interface CompanyDetailResponse {
  message: string;
  company: Company;
}

export const companiesService = {
  getBySlug: async (slug: string) => {
    return mainFetch<CompanyDetailResponse>(
      `/api/companies/${slug}`,
      undefined,
      "Unable to load this company."
    );
  },
};
