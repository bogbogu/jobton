export interface Job {
  id: number;
  company: string;
  domain: string;
  logo_url?: string | null;
  title: string;
  location: string;
  type: string;
  salary: string;
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
}