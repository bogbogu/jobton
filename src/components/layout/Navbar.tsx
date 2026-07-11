import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "Hire Freelancers", to: "/hire-freelancers" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

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
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 transition-colors duration-200">
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
          <Link
            to="/subscribe"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
          >
            Subscribe
          </Link>
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
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pb-5 pt-3 flex flex-col gap-1 shadow-md">
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
            <Link
              to="/subscribe"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
