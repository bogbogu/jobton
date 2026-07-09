import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewsletterForm from "../ui/NewsletterForm";

const Footer = () => {
  return (
    <>
      <section className="bg-blue-500 py-16 px-6 flex flex-col items-center">
        {" "}
        <div className="flex flex-col items-center max-w-xl">
          <p className="inline-block bg-white px-4 py-2 rounded-full mb-6 text-center text-sm font-medium">
            <FontAwesomeIcon icon="magnifying-glass" className="mr-2" />
            Start your job search today
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center mb-6">
            Stay ahead in your job search
          </h2>
          <p className="text-center text-blue-100 text-lg mt-2">
            Join our newsletter and get practical advice to help you stay
            organized and land your next opportunity.
          </p>
          <NewsletterForm />
        </div>
      </section>
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-6">
        <div className="flex flex-row items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#6593FC] text-white bg-blue-100- text-blue-600- group-hover:scale-110 transition-transform mr-2">
            <FontAwesomeIcon icon="suitcase" />
          </div>
          <h2 className="text-base font-bold text-primary">Jobton</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-slate-500 font-medium">
          <Link to="/">Home</Link>
          <Link to="/">Features</Link>
          <Link to="/">Find Jobs</Link>
          <Link to="/hire-freelancers">Hire Freelancers</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="text-sm text-slate-400 text-center md:text-right">
          © 2026 Jobton.
        </div>
      </section>
    </>
  );
};

export default Footer;
