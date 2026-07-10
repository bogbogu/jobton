import { useState } from "react";
import googleLogo from "../assets/images/logos/google.png";
import metaLogo from "../assets/images/logos/meta.png";
import flutterwaveLogo from "../assets/images/logos/flutterwave.png";
import microsoftLogo from "../assets/images/logos/microsoft.png";

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
    logo: flutterwaveLogo,
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
    logo: googleLogo,
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
    logo: microsoftLogo,
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
    logo: metaLogo,
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
    logo: googleLogo,
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
    logo: microsoftLogo,
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
];

export const useJobs = () => {
  const [jobs] = useState<Job[]>(jobsData);
  return { jobs };
};
