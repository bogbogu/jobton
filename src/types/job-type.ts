export interface Job {
  id: string;
  company: string;
  companySlug?: string;
  domain: string;
  logo_url?: string | null;
  title: string;
  location: string;
  type: string;
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
  applicationLink?: string;
}