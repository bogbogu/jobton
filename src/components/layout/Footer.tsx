import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewsletterForm from "../ui/NewsletterForm";

const Footer = () => {
  return (
    <>
      <section className="bg-blue-500 dark:bg-slate-800 max-w-7xl mx-auto xl:rounded-2xl py-16 px-8 flex flex-col lg:flex-row items-center justify-between gap-10 transition-colors duration-200">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="inline-block bg-white dark:bg-slate-700 dark:text-slate-200 px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <FontAwesomeIcon icon="magnifying-glass" className="mr-2" />
            Start your job search today
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold leading-tight mb-6 text-white">
            Stay ahead in your job search
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mt-2">
            Join our newsletter and get practical advice to help you stay
            organized and land your next opportunity.
          </p>
        </div>

        <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end">
          <NewsletterForm />
        </div>
      </section>
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-6 dark:bg-slate-900 transition-colors duration-200">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 font-bold text-xl">
          <span className="text-blue-600 tracking-tighter">&#187;&#187;</span>
          <span className="text-slate-900 dark:text-white ml-1">Jobton</span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition">Home</Link>
          <Link to="/about" className="hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition">About</Link>
          <Link to="/jobs" className="hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition">Find Jobs</Link>
          <Link to="/hire-freelancers" className="hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition">Hire Freelancers</Link>
          <Link to="/contact" className="hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition">Contact</Link>
        </div>

        <div className="text-sm text-slate-400 dark:text-slate-500 text-center md:text-right">
          © {new Date().getFullYear()} Jobton.
        </div>
      </section>
    </>
  );
};

export default Footer;
