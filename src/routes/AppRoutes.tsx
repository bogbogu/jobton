import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import ContactUs from "../pages/ContactUs";
import MainLayout from "../components/layout/MainLayout";
import HireFreelancersPage from "../pages/HireFreelancersPage";
import AllJobs from "../pages/AllJobs";
import SingleJobDetailPage from "../pages/SingleJobDetailPage";
import AllCategories from "../pages/AllCategories";
import AboutPage from "../pages/About";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/jobs/:id" element={<SingleJobDetailPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/hire-freelancers" element={<HireFreelancersPage />} />
        </Route>

        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
    </>
  );
};

export default AppRoutes;
