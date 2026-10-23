import type { Job } from "../types/job-type";

// The API can return jobs with no company (e.g. jobs ingested from Telegram that
// do not name the employer). Everything that draws a job must cope with that.

export const NO_COMPANY_LABEL = "Company not listed";

export const companyName = (job: Pick<Job, "company">): string =>
  job.company?.trim() || NO_COMPANY_LABEL;

// Only link to a company page when the job really has a company and the API
// produced a usable slug (an old API bug returned the literal string "undefined").
export const companyPageSlug = (job: Pick<Job, "company" | "companySlug">): string | undefined => {
  const slug = job.companySlug?.trim();
  if (!job.company?.trim() || !slug || slug === "undefined" || slug === "null") return undefined;
  return slug;
};
