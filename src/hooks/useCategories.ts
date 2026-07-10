import { useState } from "react";
import {
  Monitor,
  Megaphone,
  BriefcaseBusiness,
  Headphones,
  BarChart3,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  icon: LucideIcon;
  title: string;
  jobs: string;
}

const categoriesData: Category[] = [
  { icon: Monitor, title: "Technology", jobs: "1,240+ Jobs" },
  { icon: Megaphone, title: "Marketing", jobs: "860+ Jobs" },
  { icon: BriefcaseBusiness, title: "Sales", jobs: "620+ Jobs" },
  { icon: Headphones, title: "Customer Service", jobs: "1,100+ Jobs" },
  { icon: BarChart3, title: "Finance", jobs: "900+ Jobs" },
  { icon: Stethoscope, title: "Healthcare", jobs: "430+ Jobs" },
];

export const useCategories = () => {
  const [categories] = useState<Category[]>(categoriesData);
  return { categories };
};
