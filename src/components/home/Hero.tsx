// import { Link } from 'react-router'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatarOne from "../../assets/images/hero/1.jpg";
import avatarTwo from "../../assets/images/hero/2.jpg";
import avatarThree from "../../assets/images/hero/3.jpg";

const Hero = () => {
  return (
    <>
      <section className="relative min-h-lvh- overflow-hidden bg-gradient-to-b from-[#F8FBFF] to-white">
        {/* Background Blur */}
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"></div>
        <div className="absolute top-16 right-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"></div>

        {/* Dot Pattern */}
        <div className="absolute right-6 top-40 hidden lg:block">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-300" />
            ))}
          </div>
        </div>
<div
  className="
    absolute
    -bottom-56
    left-1/2
    -translate-x-1/2
    h-[550px]
    w-[1200px]
    rounded-full
    bg-blue-200/35
    blur-[130px]
    pointer-events-none
  "
></div>
        <div className="container mx-auto px-6 py-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
                ✓ Verified jobs. Real opportunities.
              </span>

              <h1 className="mt-8 text-6xl font-bold leading-tight text-slate-900">
                Find trusted jobs.
                <br />
                <span className="text-[#2563EB]">Build your future.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg text-slate-500">
                Jobton connects you with verified opportunities from top
                companies across Nigeria and beyond.
              </p>

              {/* Search */}
              <div className="mt-10 rounded-xl bg-white p-2 shadow-xl flex">
                <input
                  placeholder="Job title, keyword or company"
                  className="flex-1 px-4 outline-none"
                />

                <input
                  placeholder="Location"
                  className="flex-1 px-4 outline-none"
                />

                <button className="rounded-lg bg-[#2563EB] px-8 py-3 text-white">
                  Search
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
  <span className="text-sm text-slate-500">
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
      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
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
                className="absolute top-24 left-6 h-48 w-48 rounded-full object-cover border-4 border-white shadow-xl z-20"
              />

              {/* Bottom Right */}
              <img
                src={avatarTwo}
                className="absolute top-72 right-80 h-40 w-40 rounded-full object-cover border-4 border-white shadow-xl z-10"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-20 right-0 rounded-2xl bg-white px-6 py-5 shadow-2xl z-40 w-72">
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

                <h3 className="text-4xl font-bold">10,000+</h3>

                <p className="text-slate-500">
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
