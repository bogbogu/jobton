import PageBanner from "../components/ui/PageBanner";
import Categories from "../features/Categories/components/Categories";

const AllCategories = () => {
  return (
    <>
      <PageBanner
        pageTitle="Explore Job Categories"
        pageSubTitle="Find opportunities by the skills and field that fit you best."
      />
      <Categories />
    </>
  );
};

export default AllCategories;