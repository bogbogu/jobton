import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import ContactUs from "../pages/ContactUs";
import MainLayout from "../components/layout/MainLayout";
import HireFreelancersPage from "../pages/HireFreelancersPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
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
