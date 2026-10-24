import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { label: "Review queue", to: "/admin/jobs" },
  { label: "Channels", to: "/admin/channels" },
];

const AdminLayout = () => (
  <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <nav aria-label="Admin sections" className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `-mb-px inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
