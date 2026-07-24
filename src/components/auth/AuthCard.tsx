import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  logoPlacement?: "inside" | "outside" | "none";
}

const AuthCard = ({ title, description, children, logoPlacement = "inside" }: AuthCardProps) => {
  const logo = (
    <Link to="/" className="inline-flex items-center gap-1 text-xl font-bold">
      <span className="tracking-tighter text-blue-600">&raquo;&raquo;</span>
      <span className="text-slate-900 dark:text-white">Jobton</span>
    </Link>
  );

  return (
    <div className="w-full">
      {logoPlacement === "outside" && <div className="mb-5 text-center">{logo}</div>}

      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        {logoPlacement === "inside" && <div className="mb-6">{logo}</div>}

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </header>

        <div className="mt-6 space-y-4">{children}</div>
      </section>
    </div>
  );
};

export default AuthCard;
