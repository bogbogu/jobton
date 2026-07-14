import { Link } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50 px-4 py-20 sm:px-6 lg:px-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-14 top-10 h-44 w-44 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-800/30" />
        <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-900/25" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-900/20" />
      </div>

      <div className="mx-auto flex min-h-[65vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full rounded-3xl border border-sky-100/80 bg-white/90 p-8 shadow-[0_30px_90px_-40px_rgba(14,116,144,0.35)] backdrop-blur md:p-12 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[0_30px_100px_-50px_rgba(2,132,199,0.35)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-col items-center lg:block">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                <SearchX size={16} />
                Page Not Found
              </span>

              <h1 className="mt-5 text-5xl font-black leading-none tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                404
              </h1>

              <p className="flex text-center lg:block lg:text-left mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                The page you are trying to visit does not exist or may have been
                moved. You can go back, return to the homepage, or continue
                browsing open roles.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  <ArrowLeft size={16} />
                  Back Home
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
                >
                  <BriefcaseBusiness size={16} />
                  Explore Jobs
                </Link>
              </div>
            </div>

            <div className="relative mx-auto hidden h-48 w-48 items-center justify-center lg:flex">
              <div className="absolute h-full w-full rounded-full border border-sky-200/70 bg-gradient-to-br from-white to-sky-100/80 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900" />
              <div className="absolute h-28 w-28 animate-pulse rounded-full bg-sky-500/10" />
              <span className="relative text-6xl font-extrabold text-sky-600 dark:text-sky-400">
                ?
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
