export interface Company {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logo_url?: string | null;
  description: string;
  website: string;
  industry: string;
  location: string;
}
