// import { Link } from 'react-router'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatarOne from "../../../assets/images/hero/1.jpg";
import avatarTwo from "../../../assets/images/hero/2.jpg";
import avatarThree from "../../../assets/images/hero/3.jpg";

const Hero = () => {
  return (
    <>
      <section className="relative max-h-lvh-  overflow-hidden bg-gradient-to-b from-[#F8FBFF] to-white dark:from-slate-900 dark:to-slate-900 transition-colors duration-200">
        {/* Background Blur */}
        <div className="pointer-events-none absolute -top-24 -left-24 hidden h-72 w-72 rounded-full bg-sky-200/25 blur-3xl md:block md:h-96 md:w-96 md:bg-sky-200/35" />
        <div className="pointer-events-none absolute top-10 right-0 hidden h-64 w-64 rounded-full bg-blue-100/20 blur-3xl md:block md:h-80 md:w-80 md:bg-blue-100/35" />

        {/* Dot Pattern */}
        <div className="absolute right-6 top-40 hidden lg:block">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-300" />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-32 left-1/2 hidden h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-blue-200/20 blur-[100px] md:block lg:h-[520px] lg:w-[1100px] lg:bg-blue-200/30 lg:blur-[130px]" />
        <div className="container max-w-7xl mx-auto px-6 py-14 md:py-24 lg:py-28">
          <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm text-blue-700 dark:text-blue-300">
                ✓ Verified jobs. Real opportunities.
              </span>
              <h1 className="mt-5 md:mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                Find trusted jobs.
                <br />
                <span className="text-[#2563EB]">Build your future.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-slate-500 dark:text-slate-400">
                Jobton connects you with verified opportunities from top
                companies across Nigeria and beyond.
              </p>

              {/* Search */}
              <div className="mt-8 rounded-xl bg-white dark:bg-slate-800 p-2 shadow-xl flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  placeholder="Job title, keyword or company"
                  className="flex-1 px-4 py-3 sm:py-0 outline-none rounded-lg sm:rounded-none text-sm bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <div className="hidden sm:block w-px bg-slate-200 my-2" />
                <input
                  placeholder="Location"
                  className="flex-1 px-4 py-3 sm:py-0 outline-none rounded-lg sm:rounded-none text-sm bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button className="rounded-lg bg-[#2563EB] px-6 py-3 text-white text-sm font-semibold">
                  Search
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Popular searches:
                </span>

                {[
                  "Remote",
                  "Marketing",
                  "NYSC",
                  "Engineering",
                  "Data Analyst",
                ].map((item) => (
                  <button
                    key={item}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative hidden lg:flex justify-center">
              {/* Main Circle */}
              <div className="h-[420px] w-[420px] rounded-full border border-blue-100 bg-gradient-to-br from-blue-50 to-transparent"></div>
              {/* Top Right */}
              <img
                src={avatarOne}
                className="absolute top-0 right-32 h-44 w-44 rounded-full object-cover border-4 border-white shadow-xl z-30"
              />

              {/* Left */}
              <img
                src={avatarThree}
                className="absolute top-16 left-2 h-48 w-48 rounded-full object-cover border-4 border-white shadow-xl z-20"
              />

              {/* Bottom Right */}
              <img
                src={avatarTwo}
                className="absolute top-72 right-80 h-40 w-40 rounded-full object-cover border-4 border-white shadow-xl z-10"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-20 right-0 rounded-2xl bg-white dark:bg-slate-800 px-6 py-5 shadow-2xl z-40 w-72">
                <div className="flex items-center mb-3">
                  <img
                    src={avatarThree}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover z-30"
                  />
                  <img
                    src={avatarOne}
                    className="-ml-2 h-9 w-9 rounded-full border-2 border-white object-cover z-20"
                  />
                  <img
                    src={avatarTwo}
                    className="-ml-2 h-9 w-9 rounded-full border-2 border-white object-cover z-10"
                  />
                </div>
                <h3 className="text-4xl font-bold dark:text-white">10,000+</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Nigerians found jobs through Jobton
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
