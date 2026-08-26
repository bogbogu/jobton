import { useEffect, useState } from "react";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category } from "../types/category-type";
import { categoriesService } from "../services/categories.service";

// Icons are a frontend-only concern (the API never returns one) and this
// title list is the taxonomy shown to users regardless of which categories
// currently have jobs — the backend can only ever add a live job count on
// top of it. Keep this list in sync with the `category` values jobs are
// actually posted under; a title with no backend match just shows "New".
const CATEGORY_ICONS: { icon: LucideIcon; title: string }[] = [
  { icon: Monitor, title: "Technology" },
  { icon: Megaphone, title: "Marketing" },
  { icon: BriefcaseBusiness, title: "Sales" },
  { icon: Headphones, title: "Customer Service" },
  { icon: BarChart3, title: "Finance" },
  { icon: Stethoscope, title: "Healthcare" },
  { icon: Code2, title: "Software Development" },
  { icon: PenTool, title: "Design" },
  { icon: ShoppingCart, title: "E-commerce" },
  { icon: GraduationCap, title: "Education" },
  { icon: ShieldCheck, title: "Cybersecurity" },
  { icon: Landmark, title: "Public Sector" },
  { icon: Wrench, title: "Engineering" },
  { icon: Plane, title: "Travel & Hospitality" },
  { icon: Building2, title: "Real Estate" },
  { icon: Scale, title: "Legal" },
  { icon: Truck, title: "Logistics" },
  { icon: Palette, title: "Creative Media" },
];

const formatJobCount = (count: number) => {
  if (count <= 0) return "New";
  return `${count.toLocaleString()} ${count === 1 ? "Job" : "Jobs"}`;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(
    CATEGORY_ICONS.map(({ icon, title }) => ({ icon, title, jobs: formatJobCount(0) }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    categoriesService
      .list()
      .then((counts) => {
        if (!isActive) return;

        const countsByTitle = new Map(counts.map((c) => [c.title, c.jobCount]));

        setCategories(
          CATEGORY_ICONS.map(({ icon, title }) => ({
            icon,
            title,
            jobs: formatJobCount(countsByTitle.get(title) ?? 0),
          }))
        );
      })
      .catch((err) => {
        if (isActive) setError(err instanceof Error ? err.message : "Unable to load categories.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { categories, isLoading, error };
};
