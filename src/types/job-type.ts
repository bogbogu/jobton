export interface Job {
  id: string;
  company?: string | null; // missing/null on some ingested jobs
  companySlug?: string;
  domain?: string | null;
  logo_url?: string | null;
  title: string;
  location?: string | null;
  type?: string | null;
  workArrangement?: "On-site" | "Remote" | "Hybrid" | null;
  salary: string;
  category?: string;
  status: string[];
  skills: string[];
  posted: string;
  saved?: boolean;
  applicants: number;
  datePosted: string;
  industry: string;
  experience: string;
  qualification: string;
  description: string;
  responsibilities: string[];
  aboutCompany?: string | null;
  requirements?: string[] | null;
  benefits?: string[] | null;
  applicationLink?: string | null;
  applyEmail?: string | null;
  applyPhone?: string | null;
  source?: {
    kind?: string | null;
    channel?: string | null;
    url?: string | null;
  } | null;
}