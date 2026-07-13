import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PopularCategoriesCard from "../../../components/ui/cards/PopularCategoriesCard";
import { useCategories } from "../../../hooks/useCategories";

const Categories = () => {
  const { categories } = useCategories();

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-14 transition-colors duration-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-medium text-blue-600">All Categories</h2>
              <p className="mt-2 text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Discover roles by expertise
              </p>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl">
                Browse every category and find the right opportunities for your skills.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Browse all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {categories.length} categories
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <PopularCategoriesCard
                key={category.title}
                icon={category.icon}
                title={category.title}
                jobs={category.jobs}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;