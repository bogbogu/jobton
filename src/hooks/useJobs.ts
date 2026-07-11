import { useState } from "react";

export interface Job {
  id: number;
  company: string;
  logo: string;
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

const jobsData: Job[] = [
  {
    id: 1,
    company: "Flutterwave",
    logo: "https://logo.clearbit.com/flutterwave.com",
    title: "Senior Product Designer",
    location: "Lagos, Nigeria (Remote)",
    type: "Full Time",
    salary: "₦800,000 / month",
    status: ["verified"],
    skills: ["UI/UX", "Figma", "Product Strategy"],
    posted: "2 days ago",
    applicants: 15,
    datePosted: "May 20, 2026",
    industry: "Fintech",
    experience: "3–5 years",
    qualification: "B.Sc / HND",
    description:
      "We are looking for a talented Senior Product Designer to join our growing design team. You will work closely with product managers, engineers, and other designers to create intuitive, delightful, and impactful experiences for millions of users.",
    responsibilities: [
      "Design user-centered digital products and experiences",
      "Collaborate with cross-functional teams from ideation to launch",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Maintain and improve our design system",
    ],
  },
  {
    id: 2,
    company: "Google",
    logo: "https://logo.clearbit.com/google.com",
    title: "Product Designer",
    location: "Lagos, Nigeria",
    type: "Full Time",
    salary: "$8,000 / month",
    status: ["featured", "verified"],
    skills: ["UI/UX", "Figma", "Research"],
    posted: "3 days ago",
    applicants: 30,
    datePosted: "May 19, 2026",
    industry: "Technology",
    experience: "4–6 years",
    qualification: "B.Sc",
    description:
      "Join Google's product design team and help shape the future of search and beyond. You will work on products used by billions of people worldwide.",
    responsibilities: [
      "Lead design for key product areas within Google Search",
      "Collaborate with cross-functional teams across time zones",
      "Conduct and synthesise user research",
      "Produce high-fidelity designs and prototypes",
    ],
  },
  {
    id: 3,
    company: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    title: "UI/UX Designer",
    location: "Abuja, Nigeria",
    type: "On-site",
    salary: "₦500,000 / month",
    status: ["verified"],
    skills: ["Figma", "Azure", "UX Research"],
    posted: "3 days ago",
    applicants: 18,
    datePosted: "May 19, 2026",
    industry: "Technology",
    experience: "2–4 years",
    qualification: "B.Sc / HND",
    description:
      "Microsoft is hiring a UI/UX Designer to work on enterprise productivity tools. You will collaborate with engineers and PMs to deliver high-quality user experiences across Africa.",
    responsibilities: [
      "Design interfaces for Microsoft enterprise products",
      "Create and maintain the design system",
      "Partner with PMs and engineers to ship features",
      "Gather and act on user feedback",
    ],
  },
  {
    id: 4,
    company: "Meta",
    logo: "https://logo.clearbit.com/meta.com",
    title: "Product Designer",
    location: "Remote",
    type: "Contract",
    salary: "$2,000 – $2,500 / month",
    status: ["verified"],
    skills: ["React", "Figma", "Motion Design"],
    posted: "4 days ago",
    applicants: 42,
    datePosted: "May 18, 2026",
    industry: "Social Media",
    experience: "3–5 years",
    qualification: "B.Sc",
    description:
      "Meta is seeking a Product Designer to work on next-generation social experiences. You will be part of a fully remote, globally distributed team shaping the future of connection.",
    responsibilities: [
      "Design features for Meta's social products",
      "Work closely with engineers on implementation",
      "Create prototypes and high-fidelity mockups",
      "Champion accessibility in all designs",
    ],
  },
  {
    id: 5,
    company: "Google",
    logo: "https://logo.clearbit.com/google.com",
    title: "Senior UX Designer",
    location: "Remote",
    type: "Full Time",
    salary: "₦900,000 / month",
    status: ["featured"],
    skills: ["UX Research", "Figma", "Prototyping"],
    posted: "5 days ago",
    applicants: 25,
    datePosted: "May 17, 2026",
    industry: "Technology",
    experience: "5+ years",
    qualification: "B.Sc",
    description:
      "We are looking for a Senior UX Designer to lead the design of Google's developer tools. You will shape the experience for millions of developers globally.",
    responsibilities: [
      "Lead UX for developer-facing products",
      "Define and drive design strategy",
      "Mentor junior designers on the team",
      "Champion user research as a core practice",
    ],
  },
  {
    id: 6,
    company: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    title: "Product Designer",
    location: "On-site",
    type: "Full Time",
    salary: "₦600,000 / month",
    status: ["verified"],
    skills: ["Figma", "Azure DevOps", "Sketch"],
    posted: "5 days ago",
    applicants: 10,
    datePosted: "May 17, 2026",
    industry: "Technology",
    experience: "2–3 years",
    qualification: "B.Sc / HND",
    description:
      "Join the Microsoft Nigeria team as a Product Designer, working on cloud productivity products that power businesses across Africa.",
    responsibilities: [
      "Create UX flows and wireframes",
      "Collaborate with engineers and PMs",
      "Contribute to the design system",
      "Present designs to key stakeholders",
    ],
  },
  {
    id: 7,
    company: "Spotify",
    logo: "https://logo.clearbit.com/spotify.com",
    title: "Product Designer",
    location: "Remote",
    type: "Full Time",
    salary: "$6,500 / month",
    status: ["featured"],
    skills: ["Figma", "Design Systems", "Prototyping"],
    posted: "1 day ago",
    applicants: 12,
    datePosted: "May 21, 2026",
    industry: "Music Streaming",
    experience: "3–5 years",
    qualification: "B.Sc",
    description:
      "Join Spotify's product design team to craft engaging experiences for millions of listeners worldwide.",
    responsibilities: [
      "Design intuitive user interfaces",
      "Collaborate with engineers and PMs",
      "Prototype new features",
      "Conduct usability testing",
    ],
  },
  {
    id: 8,
    company: "Netflix",
    logo: "https://logo.clearbit.com/netflix.com",
    title: "Senior UI Designer",
    location: "Remote",
    type: "Full Time",
    salary: "$7,800 / month",
    status: ["verified"],
    skills: ["UI Design", "Figma", "Interaction Design"],
    posted: "Today",
    applicants: 8,
    datePosted: "May 22, 2026",
    industry: "Entertainment",
    experience: "5+ years",
    qualification: "B.Sc",
    description:
      "Help shape the future of streaming experiences across TV, web, and mobile platforms.",
    responsibilities: [
      "Design high-quality interfaces",
      "Improve design systems",
      "Work closely with engineering",
      "Present concepts to stakeholders",
    ],
  },
  {
    id: 9,
    company: "Airbnb",
    logo: "https://logo.clearbit.com/airbnb.com",
    title: "UX Designer",
    location: "Remote",
    type: "Full Time",
    salary: "$6,900 / month",
    status: ["featured", "verified"],
    skills: ["Research", "Figma", "User Flows"],
    posted: "2 days ago",
    applicants: 20,
    datePosted: "May 20, 2026",
    industry: "Travel",
    experience: "3–5 years",
    qualification: "B.Sc",
    description:
      "Design seamless booking and hosting experiences used by millions around the globe.",
    responsibilities: [
      "Create user journeys",
      "Conduct research",
      "Produce prototypes",
      "Collaborate across teams",
    ],
  },
  {
    id: 10,
    company: "Paystack",
    logo: "https://logo.clearbit.com/paystack.com",
    title: "Product Designer",
    location: "Lagos, Nigeria",
    type: "Hybrid",
    salary: "₦950,000 / month",
    status: ["verified"],
    skills: ["Figma", "Design Systems", "UX"],
    posted: "Today",
    applicants: 6,
    datePosted: "May 22, 2026",
    industry: "Fintech",
    experience: "2–4 years",
    qualification: "B.Sc / HND",
    description:
      "Work with the Paystack team to build delightful payment experiences for African businesses.",
    responsibilities: [
      "Design new product features",
      "Collaborate with PMs",
      "Maintain design system",
      "Improve onboarding flows",
    ],
  },
  {
    id: 11,
    company: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    title: "Visual Designer",
    location: "Remote",
    type: "Contract",
    salary: "$5,500 / month",
    status: ["featured"],
    skills: ["Brand Design", "Figma", "Illustration"],
    posted: "3 days ago",
    applicants: 15,
    datePosted: "May 19, 2026",
    industry: "Productivity",
    experience: "2–5 years",
    qualification: "B.Sc",
    description:
      "Help evolve Notion's visual language across product and marketing experiences.",
    responsibilities: [
      "Create polished UI visuals",
      "Design marketing assets",
      "Collaborate with product teams",
      "Maintain visual consistency",
    ],
  },
];

export const useJobs = () => {
  const [jobs] = useState<Job[]>(jobsData);
  return { jobs };
};
