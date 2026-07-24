import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import ContactUs from "../pages/ContactUs";
import MainLayout from "../components/layout/MainLayout";
import HireFreelancersPage from "../pages/HireFreelancersPage";
import AllJobs from "../pages/AllJobs";
import SingleJobDetailPage from "../pages/SingleJobDetailPage";
import AllCategories from "../pages/AllCategories";
import AboutPage from "../pages/About";
import ScrollToTop from "../components/layout/ScrollToTop";
import NotFound from "../pages/NotFound";
import SingleFreelancerDetailPage from "../pages/SingleFreelancerDetailPage";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import VerifyEmailPage from "../pages/auth/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/jobs/:id" element={<SingleJobDetailPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/hire-freelancers" element={<HireFreelancersPage />} />
            <Route path="/hire-freelancers/:id" element={<SingleFreelancerDetailPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          {/* Phase 2 auth routes: safe to comment out when auth is disabled */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
