import { Link } from "react-router-dom";
import PopularCategoriesCard from "../../../components/ui/cards/PopularCategoriesCard";
import { useCategories } from "../../../hooks/useCategories";
import { ArrowRight } from "lucide-react";

const PopularCategories = () => {
  const { categories } = useCategories();
  const popularCategories = categories.slice(0, 6);

  return (
    <section className="bg-white dark:bg-slate-900 max-w-7xl mx-auto py-20 transition-colors duration-200">
      <div className="container mx-auto px-6">

        <div className="mb-14">
          <div className="flex items-center justify-between md:hidden">
            <h2 className="font-medium text-blue-600">Popular Categories</h2>
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden md:flex items-end justify-between">
            <div>
              <h2 className="font-medium text-blue-600">Popular Categories</h2>
              <p className="mt-2 text-xl sm:text-2xl lg:text-4xl font-bold dark:text-white">
                Explore jobs by category
              </p>
              <p className="mt-4 max-w-xl text-slate-500 dark:text-slate-400">
                Discover verified openings from top employers hiring now.
              </p>
            </div>
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 font-medium text-blue-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 md:hidden">
            <p className="text-xl sm:text-2xl lg:text-4xl font-bold dark:text-white">
              Explore jobs by category
            </p>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Discover verified openings from top employers hiring now.
            </p>
          </div>
        </div>




        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {popularCategories.map((category) => (
            <PopularCategoriesCard
              key={category.title}
              icon={category.icon}
              title={category.title}
              jobs={category.jobs}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
