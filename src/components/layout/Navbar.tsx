import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "Hire Freelancers", to: "/hire-freelancers" },
  { label: "Contact", to: "/contact" },
];

const SHOW_AUTH_NAV = false;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (!menuOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [menuOpen]);

  const enableLight = () => {
    setIsDark(false);
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  };

  const enableDark = () => {
    setIsDark(true);
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 transition-colors duration-200">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 font-bold text-xl">
          <span className="text-blue-600 tracking-tighter">&#187;&#187;</span>
          <span className="text-slate-900 dark:text-white ml-1">Jobton</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive ? "text-blue-600" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={enableLight}
            title="Light mode"
            className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${!isDark ? "text-amber-500" : "text-slate-400"}`}
          >
            <Sun size={18} />
          </button>
          <button
            onClick={enableDark}
            title="Dark mode"
            className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${isDark ? "text-blue-500" : "text-slate-400"}`}
          >
            <Moon size={18} />
          </button>

          {/* Phase 2 auth actions: toggle SHOW_AUTH_NAV when you want auth in navigation */}
          {SHOW_AUTH_NAV && (isAuthLoading ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">Checking session...</span>
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300">{user?.name ?? user?.email}</span>
              <button
                onClick={logout}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold px-5 py-2 rounded-full transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
              >
                Register
              </Link>
            </>
          ))}
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-16 z-[80] bg-slate-900/20 backdrop-blur-[1px] md:hidden"
          />

          <div className="fixed left-0 right-0 top-16 z-[90] max-h-[calc(100dvh-4rem)] overflow-y-auto md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pb-5 pt-3 flex flex-col gap-1 shadow-xl">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={enableLight}
                  title="Light mode"
                  className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${!isDark ? "text-amber-500" : "text-slate-400"}`}
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={enableDark}
                  title="Dark mode"
                  className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${isDark ? "text-blue-500" : "text-slate-400"}`}
                >
                  <Moon size={18} />
                </button>
              </div>
              {SHOW_AUTH_NAV && (
                <Link
                to={isAuthenticated ? "/" : "/login"}
                onClick={() => {
                  if (isAuthenticated) logout();
                  setMenuOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
              >
                {isAuthenticated ? "Logout" : "Login"}
              </Link>
              )}
            </div>

            {SHOW_AUTH_NAV && !isAuthenticated && !isAuthLoading && (
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-3 inline-flex justify-center rounded-full border border-slate-200 dark:border-slate-700 px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Register
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
