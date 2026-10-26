import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark,
  Share2,
  Flag,
  ChevronDown,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../../components/ui/JobCard";
import FilterSelect from "../../../components/ui/FilterSelect";
import Pagination from "../../../components/ui/Pagination";
import { Skeleton } from "../../../components/ui/Skeleton";
import SlowLoadNotice from "../../../components/ui/SlowLoadNotice";
import JobDetail from "./JobDetail";
import { JobListSkeleton, JobDetailSkeleton } from "./JobsSkeletons";
import { useJobsPageService } from "../services/useJobsPageService";
import { jobTypeOptions, industryOptions, categoryOptions, sortOptions, reportReasonOptions } from "../../../constants/fieldsKeyValues";

const Jobs = () => {
  const navigate = useNavigate();

  const {
    jobs,
    page,
    total,
    totalPages,
    rangeStart,
    rangeEnd,
    statusMessage,
    showSkeleton,
    isFirstLoad,
    isPageLoading,
    isDetailLoading,
    error,
    retry,
    handlePageChange,
    listTopRef,
    viewedIds,
    markViewed,
    keyword, setKeyword,
    location, setLocation,
    selectedType, setSelectedType,
    selectedIndustry, setSelectedIndustry,
    selectedCategory, setSelectedCategory,
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
    toggleSave,
    handleShare,
    handleOpenReportModal,
    handleCloseReportModal,
    handleReport,
    canSubmitReport,
    showReportModal,
    selectedReportReason, setSelectedReportReason,
    otherReportReason, setOtherReportReason,
    OTHER_REPORT_REASON_KEY,
    isSelectedJobSaved,
    isSelectedJobReported,
    shareToast,
    reportToast,
  } = useJobsPageService();

  const handleJobCardClick = (job: (typeof jobs)[number]) => {
    markViewed(job.id);

    if (window.innerWidth < 768) {
      navigate(`/jobs/${job.id}`);
      return;
    }

    handleCardClick(job);
  };

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Always mounted so screen readers announce each change after a load. */}
        <div role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </div>

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
          <FilterSelect
            value={selectedType}
            onChange={setSelectedType}
            placeholderLabel="Job Type"
            options={jobTypeOptions}
            clearAriaLabel="Clear job type filter"
            selectClassName="text-sm border border-slate-200 dark:border-slate-600 rounded-full pl-4 py-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer outline-none"
          />
          <FilterSelect
            value={selectedIndustry}
            onChange={setSelectedIndustry}
            placeholderLabel="Industry"
            options={industryOptions}
            clearAriaLabel="Clear industry filter"
            selectClassName="text-sm border border-slate-200 dark:border-slate-600 rounded-full pl-4 py-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer outline-none"
          />
          <FilterSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholderLabel="Category"
            options={categoryOptions}
            clearAriaLabel="Clear category filter"
            selectClassName="text-sm border border-slate-200 dark:border-slate-600 rounded-full pl-4 py-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 cursor-pointer outline-none"
          />
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
            <FilterSelect
              value={selectedType}
              onChange={setSelectedType}
              placeholderLabel="All Job Types"
              options={jobTypeOptions}
              clearAriaLabel="Clear job type filter"
              fullWidth
              selectClassName="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl pl-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 outline-none"
            />
            <FilterSelect
              value={selectedIndustry}
              onChange={setSelectedIndustry}
              placeholderLabel="All Industries"
              options={industryOptions}
              clearAriaLabel="Clear industry filter"
              fullWidth
              selectClassName="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl pl-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 outline-none"
            />
            <FilterSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholderLabel="All Categories"
              options={categoryOptions}
              clearAriaLabel="Clear category filter"
              fullWidth
              selectClassName="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl pl-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 outline-none"
            />
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
        <div ref={listTopRef} className="flex items-center justify-between mb-4 scroll-mt-20">
          <h2 className="text-sm text-slate-500 dark:text-slate-400">
            {showSkeleton ? (
              <>
                <span className="sr-only">Loading jobs</span>
                <Skeleton className="h-4 w-28" />
              </>
            ) : error ? (
              "Jobs"
            ) : (
              `${total.toLocaleString()} ${total === 1 ? "job" : "jobs"} found`
            )}
          </h2>
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

            {/* Save / Share / Report */}
            {selectedJob && (
              <div className="flex items-center gap-2 md:gap-3 text-sm relative">
                <button
                  onClick={handleSave}
                  disabled={isPageLoading}
                  aria-label={isSelectedJobSaved ? "Saved" : "Save job"}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 md:px-0 md:py-0 transition ${
                    isSelectedJobSaved ? "text-blue-600 font-medium" : "text-slate-400 hover:text-slate-700"
                  } disabled:opacity-50 disabled:cursor-wait`}
                >
                  <Bookmark size={14} className={isSelectedJobSaved ? "fill-blue-600" : ""} />
                  <span className="hidden md:inline">{isSelectedJobSaved ? "Saved" : "Save"}</span>
                </button>
                <button
                  onClick={handleShare}
                  aria-label={shareToast ? "Copied" : "Share job"}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 md:px-0 md:py-0 text-slate-400 hover:text-slate-700 transition"
                >
                  <Share2 size={14} />
                  <span className="hidden md:inline">{shareToast ? "Copied!" : "Share"}</span>
                </button>
                <button
                  onClick={handleOpenReportModal}
                  disabled={isSelectedJobReported}
                  aria-label={isSelectedJobReported ? "Job reported" : "Report job"}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 md:px-0 md:py-0 transition ${
                    isSelectedJobReported ? "text-red-400 cursor-default" : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  <Flag size={14} className={isSelectedJobReported ? "fill-red-400" : ""} />
                  <span className="hidden md:inline">{reportToast ? "Reported" : isSelectedJobReported ? "Reported" : "Report"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Outside the aria-busy list so its message is announced. */}
        {isFirstLoad && <SlowLoadNotice className="mb-4" />}

        {/* Split panel */}
        <div className="flex gap-6 items-start">
          {/* Left — job list */}
          <div className="w-full md:w-5/12 flex flex-col gap-3" aria-busy={showSkeleton || isPageLoading}>
            {showSkeleton ? (
              <JobListSkeleton />
            ) : error ? (
              <>
                <div role="alert" className="py-16 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
                  <button
                    onClick={retry}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
                  >
                    Try again
                  </button>
                </div>
                {/* If one page fails, the others can still be tried. */}
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} className="mt-1" />
              </>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isFiltered
                    ? "No jobs match your search. Try different keywords or clear your filters."
                    : "There are no jobs to show right now. Please check back soon."}
                </p>
                {isFiltered && (
                  <button
                    onClick={handleReset}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* While the next page loads the old one stays, dimmed and unclickable. */}
                <div
                  inert={isPageLoading}
                  className={`flex flex-col gap-3 transition-opacity ${isPageLoading ? "opacity-60" : ""}`}
                >
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleJobCardClick(job)}
                      className={`relative cursor-pointer rounded-3xl transition ring-2 focus-within:ring-blue-300 ${
                        selectedJob?.id === job.id
                          ? "ring-blue-500"
                          : "ring-transparent hover:ring-slate-200"
                      }`}
                    >
                      {/* Keyboard way to open the card: a real button beside (not around)
                          the card's own save/company controls. Its click bubbles up to the
                          wrapper above, so Enter/Space do exactly what a mouse click does. */}
                      <button
                        type="button"
                        aria-current={selectedJob?.id === job.id ? "true" : undefined}
                        className="sr-only"
                      >
                        View details: {job.title}
                      </button>
                      <JobCard job={job} viewed={viewedIds.has(job.id)} onToggleSave={() => toggleSave(job)} />
                    </div>
                  ))}
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
                  Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of {total.toLocaleString()}
                </p>
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} className="mt-1" />
              </>
            )}
          </div>

          {/* Right — sticky detail, md and above */}
          <div className="hidden md:block md:w-7/12 sticky top-24 self-start">
            {isDetailLoading ? (
              <JobDetailSkeleton />
            ) : (
              selectedJob && <JobDetail job={selectedJob} />
            )}
          </div>
        </div>

        {showReportModal && (
          <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex items-center justify-center p-4">
            <button
              aria-label="Close report modal"
              onClick={handleCloseReportModal}
              className="absolute inset-0 bg-slate-900/40"
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100">Report Job</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tell us why you are reporting this listing.
                  </p>
                </div>
                <button
                  onClick={handleCloseReportModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Suggested reasons</p>
                <div className="flex flex-wrap gap-2">
                  {reportReasonOptions.map((reason) => (
                    <button
                      key={reason.key}
                      onClick={() => setSelectedReportReason(reason.key)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition ${
                        selectedReportReason === reason.key
                          ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/30"
                          : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      {reason.value}
                    </button>
                  ))}
                </div>

                {selectedReportReason === OTHER_REPORT_REASON_KEY && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                      Other reason
                    </label>
                    <textarea
                      value={otherReportReason}
                      onChange={(e) => setOtherReportReason(e.target.value)}
                      rows={3}
                      placeholder="Please provide additional details"
                      className="w-full text-sm outline-none rounded-xl border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 bg-white dark:bg-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleCloseReportModal}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={!canSubmitReport}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    canSubmitReport
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;

