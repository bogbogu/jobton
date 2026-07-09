import { Users, BriefcaseBusiness, Building2, MailCheck } from "lucide-react";
import React from "react";

const Metrics = () => {
  return (
    <>
      <section className="py-10 px-6 flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-bold text-2xl">How we're doing in Numbers</h2>
          <h3 className="text-slate-500 mt-2 max-w-lg mx-auto">
            Live totals from job seekers using the platform.
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4 max-w-5xl w-full">
          <div className="bg-white rounded-2xl p-3 text-center group flex flex-col items-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform mb-1">
              <Users size={20} strokeWidth={2.2} />
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight px-0.5">
              Job Seekers
            </div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 tabular-nums leading-none">
              557
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 text-center group flex flex-col items-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform mb-1">
              <BriefcaseBusiness size={20} strokeWidth={2.2} />
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight px-0.5">
              Applications Tracked
            </div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 tabular-nums leading-none">
              969
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 text-center group flex flex-col items-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform mb-1">
              <Building2 size={20} strokeWidth={2.2} />
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight px-0.5">
              Companies Reached
            </div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 tabular-nums leading-none">
              893
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 text-center group flex flex-col items-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform mb-1">
              <MailCheck size={20} strokeWidth={2.2} />
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight px-0.5">
              Emails Processed
            </div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 tabular-nums leading-none">
              2,208
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Metrics;