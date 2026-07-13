import { useState } from "react";
import {
  Monitor,
  Megaphone,
  BriefcaseBusiness,
  Headphones,
  BarChart3,
  Stethoscope,
  Code2,
  PenTool,
  ShoppingCart,
  GraduationCap,
  ShieldCheck,
  Landmark,
  Wrench,
  Plane,
  Building2,
  Scale,
  Truck,
  Palette,
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
  { icon: Code2, title: "Software Development", jobs: "1,380+ Jobs" },
  { icon: PenTool, title: "Design", jobs: "540+ Jobs" },
  { icon: ShoppingCart, title: "E-commerce", jobs: "710+ Jobs" },
  { icon: GraduationCap, title: "Education", jobs: "390+ Jobs" },
  { icon: ShieldCheck, title: "Cybersecurity", jobs: "460+ Jobs" },
  { icon: Landmark, title: "Public Sector", jobs: "280+ Jobs" },
  { icon: Wrench, title: "Engineering", jobs: "760+ Jobs" },
  { icon: Plane, title: "Travel & Hospitality", jobs: "310+ Jobs" },
  { icon: Building2, title: "Real Estate", jobs: "350+ Jobs" },
  { icon: Scale, title: "Legal", jobs: "220+ Jobs" },
  { icon: Truck, title: "Logistics", jobs: "480+ Jobs" },
  { icon: Palette, title: "Creative Media", jobs: "410+ Jobs" },
];

export const useCategories = () => {
  const [categories] = useState<Category[]>(categoriesData);
  return { categories };
};
