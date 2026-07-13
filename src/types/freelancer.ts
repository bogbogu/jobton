export type FreelancerHandlePlatform =
  | "LinkedIn"
  | "X"
  | "Instagram"
  | "Portfolio"
  | "WhatsApp";

export interface FreelancerHandle {
  platform: FreelancerHandlePlatform;
  href: string;
}

export interface FreelancerProfile {
  id: number;
  name: string;
  role: string;
  category: string;
  location: string;
  availability: "Available now" | "Available next week" | "Limited availability";
  hourlyRate: string;
  yearsExperience: number;
  projectsCompleted: number;
  rating: number;
  bio: string;
  skills: string[];
  email: string;
  phone: string;
  handles: FreelancerHandle[];
}
