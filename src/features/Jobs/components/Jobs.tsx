import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark,
  Share2,
  Flag,
  ChevronDown,
} from "lucide-react";
import JobCard from "../../../components/ui/JobCard";
import JobDetail from "./JobDetail";
import { useJobsPageService } from "../services/useJobsPageService";
import { jobTypeOptions, industryOptions, sortOptions } from "../../../constants/fieldsKeyValues";

const Jobs = () => {
  const {
    filteredJobs,
    keyword, setKeyword,
    location, setLocation,
    selectedType, setSelectedType,
    selectedIndustry, setSelectedIndustry,
    sortBy, setSortBy,
    showSort, setShowSort,
    showMobileFilters, setShowMobileFilters,
    showMobileSort, setShowMobileSort,
    selectedJob,
    isFiltered,
    handleSearch,
    handleReset,
    handleCardClick,
    handleSave,
    handleShare,
    handleReport,
    isSelectedJobSaved,
    isSelectedJobReported,
    shareToast,
    reportToast,
  } = useJobsPageService();

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Search bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-3 flex flex-col md:flex-row gap-2 mb-5">
          <div className="flex items-center gap-2 flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title, keyword, or company"
              className="w-full text-sm outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5">
            <MapPin size={15} className="text-slate-400 shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Location"
              className="w-full text-sm outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition"
          >
            Search
          </button>
        </div>

        {/* Filters — desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2 mb-6">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-full px-4 py-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer outline-none"
          >
            <option value="">Job Type ▾</option>
            {jobTypeOptions.map((t) => <option key={t.key} value={t.value}>{t.value}</option>)}
          </select>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-full px-4 py-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer outline-none"
          >
            <option value="">Industry ▾</option>
            {industryOptions.map((i) => <option key={i.key} value={i.value}>{i.value}</option>)}
          </select>
          {isFiltered && (
            <button onClick={handleReset} className="text-sm text-blue-600 font-medium hover:underline ml-1">
              Reset
            </button>
          )}
        </div>

        {/* Filters — mobile toggle buttons */}
        <div className="flex md:hidden gap-2 mb-3">
          <button
            onClick={() => { setShowMobileFilters(!showMobileFilters); setShowMobileSort(false); }}
            className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium transition ${
              showMobileFilters ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
            }`}
          >
            <SlidersHorizontal size={14} /> Filters {isFiltered && <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1.5">•</span>}
          </button>
          <button
            onClick={() => { setShowMobileSort(!showMobileSort); setShowMobileFilters(false); }}
            className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium transition ${
              showMobileSort ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
            }`}
          >
            <ArrowUpDown size={14} /> {sortBy}
          </button>
        </div>

        {/* Mobile filter panel */}
        {showMobileFilters && (
          <div className="md:hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-4 flex flex-col gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 outline-none"
            >
              <option value="">All Job Types</option>
              {jobTypeOptions.map((t) => <option key={t.key} value={t.value}>{t.value}</option>)}
            </select>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 outline-none"
            >
              <option value="">All Industries</option>
              {industryOptions.map((i) => <option key={i.key} value={i.value}>{i.value}</option>)}
            </select>
            {isFiltered && (
              <button onClick={handleReset} className="text-sm text-blue-600 font-medium self-start hover:underline">
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Mobile sort panel */}
        {showMobileSort && (
          <div className="md:hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 mb-4">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setSortBy(opt.value); setShowMobileSort(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  sortBy === opt.value ? "text-blue-600 font-semibold" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {opt.value}
              </button>
            ))}
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing 1–{filteredJobs.length} of {filteredJobs.length} results
          </p>
          <div className="flex items-center gap-4">
            {/* Sort — desktop */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition"
              >
                <ArrowUpDown size={13} /> {sortBy} <ChevronDown size={13} />
              </button>
              {showSort && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-10 min-w-[160px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                        sortBy === opt.value ? "text-blue-600 font-medium" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {opt.value}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save / Share / Report — desktop */}
            {selectedJob && (
              <div className="hidden md:flex items-center gap-3 text-sm relative">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 transition ${
                    isSelectedJobSaved ? "text-blue-600 font-medium" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Bookmark size={14} className={isSelectedJobSaved ? "fill-blue-600" : ""} />
                  {isSelectedJobSaved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition"
                >
                  <Share2 size={14} />
                  {shareToast ? "Copied!" : "Share"}
                </button>
                <button
                  onClick={handleReport}
                  disabled={isSelectedJobReported}
                  className={`flex items-center gap-1.5 transition ${
                    isSelectedJobReported ? "text-red-400 cursor-default" : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  <Flag size={14} className={isSelectedJobReported ? "fill-red-400" : ""} />
                  {reportToast ? "Reported" : isSelectedJobReported ? "Reported" : "Report"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Split panel */}
        <div className="flex gap-6 items-start">
          {/* Left — job list */}
          <div className="w-full md:w-5/12 flex flex-col gap-3">
            {filteredJobs.length === 0 ? (
              <p className="text-sm text-slate-400 py-16 text-center">No jobs found. Try a different search.</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleCardClick(job)}
                  className={`cursor-pointer rounded-3xl transition ring-2 ${
                    selectedJob?.id === job.id
                      ? "ring-blue-500"
                      : "ring-transparent hover:ring-slate-200"
                  }`}
                >
                  <JobCard job={job} />
                </div>
              ))
            )}
          </div>

          {/* Right — sticky detail, md and above */}
          <div className="hidden md:block md:w-7/12 sticky top-24 self-start">
            {selectedJob && <JobDetail job={selectedJob} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jobs;

