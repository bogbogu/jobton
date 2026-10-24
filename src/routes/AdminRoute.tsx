import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * UX guard for /admin/*. The backend enforces admin access on every request;
 * this only avoids rendering admin UI for people who cannot use it.
 */
const AdminRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm text-slate-600 dark:text-slate-400">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Not authorized</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
