import { Link } from "react-router";
import PopularCategoriesCard from "../ui/cards/PopularCategoriesCard";
import { categories } from "../../lib/categories";

const PopularCategories = () => {
    return (
        <section className="bg-white max-w-7xl mx-auto py-20">
            <div className="container mx-auto px-6">
                <div className="mb-14 flex items-end justify-between">
                    <div>
                        <p className="font-medium text-blue-600">
                            Popular Categories
                        </p>

                        <h2 className="mt-2 text-4xl font-bold">Explore jobs by category
                        </h2>

                        <p className="mt-4 max-w-xl text-slate-500">
                            Discover verified openings from top employers hiring now.
                        </p>
                    </div>
                    <Link to="/" className="font-medium text-blue-600">
                        View all categories
                    </Link>
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
        </section>
    );
};

export default PopularCategories;