import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Job } from "../../../types/job-type";
import { jobsService } from "../../../services/jobs.service";
import { usePagedJobs, JOBS_PAGE_SIZE } from "../../../hooks/usePagedJobs";
import { useViewedJobs } from "../../../hooks/useViewedJobs";
import { sortOptions, OTHER_REPORT_REASON_KEY } from "../../../constants/fieldsKeyValues";

// Caps for values read from the URL, which anyone can edit or share.
const MAX_PAGE = 10000;
const MAX_TEXT_LENGTH = 100;

const readText = (raw: string | null) => (raw ?? "").trim().slice(0, MAX_TEXT_LENGTH);

// Whole numbers from 1 up; anything else (0, -2, 1.5, "abc") is page 1 and
// an absurdly large number is held at MAX_PAGE, which the page then pulls
// back to the real last page once it knows how many there are.
const parsePage = (raw: string | null) => {
  if (!raw || !/^\d+$/.test(raw)) return 1;
  return Math.min(MAX_PAGE, Math.max(1, Number(raw)));
};

export const useJobsPageService = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth for the page, the filters, the sort and
  // the selected job, so back/forward and shared links all just work.
  const page = parsePage(searchParams.get("page"));
  const urlKeyword = readText(searchParams.get("keyword"));
  const urlLocation = readText(searchParams.get("location"));
  const selectedType = readText(searchParams.get("type"));
  const selectedIndustry = readText(searchParams.get("industry"));
  const selectedCategory = readText(searchParams.get("category"));
  const rawSort = searchParams.get("sort");
  const sortOption = sortOptions.find((option) => option.key === rawSort) ?? sortOptions[0];
  const sortBy = sortOption.value;
  const selectedId = searchParams.get("selected");

  const {
    jobs,
    pagination,
    isLoaded,
    isInitialLoading,
    isPageLoading,
    error,
    retry,
    toggleSave: toggleSaveInList,
  } = usePagedJobs({
    page,
    keyword: urlKeyword,
    location: urlLocation,
    type: selectedType,
    industry: selectedIndustry,
    category: selectedCategory,
    sort: sortOption.key,
  });

  // Search inputs (live) — applied to the URL on submit. They follow the URL
  // when it changes underneath them (back/forward, "Clear filters").
  const [keyword, setKeyword] = useState(urlKeyword);
  const [location, setLocation] = useState(urlLocation);
  const [syncedSearch, setSyncedSearch] = useState({ keyword: urlKeyword, location: urlLocation });
  if (syncedSearch.keyword !== urlKeyword || syncedSearch.location !== urlLocation) {
    setSyncedSearch({ keyword: urlKeyword, location: urlLocation });
    setKeyword(urlKeyword);
    setLocation(urlLocation);
  }

  const [showSort, setShowSort] = useState(false);

  // Mobile panels
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Share / Report (save is backend-persisted now — see usePagedJobs' toggleSave)
  const [reportedJobIds, setReportedJobIds] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const [reportToast, setReportToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");

  const { viewedIds, markViewed } = useViewedJobs();

  const listTopRef = useRef<HTMLDivElement>(null);

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const isFiltered = !!(urlKeyword || urlLocation || selectedType || selectedIndustry || selectedCategory);

  // A page number past the end (an old link, a hand-typed URL) is replaced
  // by the last page — or, when there are no results at all, by page 1.
  const lastPage = Math.max(1, totalPages);
  const isPastLastPage = isLoaded && page > lastPage;

  useEffect(() => {
    if (!isPastLastPage) return;
    const next = new URLSearchParams(searchParams);
    if (lastPage > 1) next.set("page", String(lastPage));
    else next.delete("page");
    next.delete("selected");
    setSearchParams(next, { replace: true });
  }, [isPastLastPage, lastPage, searchParams, setSearchParams]);

  // Tidy a malformed or redundant `?page=` (abc, 0, 1, 007) in the address bar.
  useEffect(() => {
    const raw = searchParams.get("page");
    const canonical = page > 1 ? String(page) : null;
    if (raw === null || raw === canonical) return;
    const next = new URLSearchParams(searchParams);
    if (canonical) next.set("page", canonical);
    else next.delete("page");
    setSearchParams(next, { replace: true });
  }, [searchParams, page, setSearchParams]);

  // --- selection -----------------------------------------------------------
  // `?selected=` can name a job that is not on the current page (arriving
  // from the home page's Featured Jobs). Such a job is fetched on its own and
  // shown in the detail pane without touching the list.
  const [extra, setExtra] = useState<{ id: string; job: Job | null } | null>(null);
  const inPage = selectedId ? jobs.find((job) => job.id === selectedId) : undefined;
  const needsExtra = isLoaded && !isPastLastPage && !!selectedId && !inPage && jobs.length > 0;
  const extraId = extra?.id;

  useEffect(() => {
    if (!needsExtra || !selectedId || extraId === selectedId) return;
    let cancelled = false;

    jobsService
      .getById(selectedId)
      .then(({ job }) => {
        if (!cancelled) setExtra({ id: selectedId, job });
      })
      .catch(() => {
        // Missing or hidden job: fall back to the first job of the page.
        if (!cancelled) setExtra({ id: selectedId, job: null });
      });

    return () => {
      cancelled = true;
    };
  }, [needsExtra, selectedId, extraId]);

  const isExtraPending = needsExtra && extraId !== selectedId;

  // The selected job is always derived: the one named in the URL, else the
  // first job of the page — so a new page or filter selects its first job
  // without any sync step.
  let resolvedJob: Job | undefined;
  if (isLoaded && !isPastLastPage && !isExtraPending) {
    const fetchedJob = needsExtra && extra?.id === selectedId ? extra.job : null;
    resolvedJob = inPage ?? fetchedJob ?? jobs[0];
  }

  // While only the page number changes the old list stays up, so the detail
  // pane keeps showing the job it had rather than jumping to the old page's
  // first job.
  const [heldJob, setHeldJob] = useState<Job | undefined>(undefined);
  if (!isPageLoading && heldJob !== resolvedJob) setHeldJob(resolvedJob);
  const selectedJob = isPageLoading ? heldJob : resolvedJob;

  // The old list is not kept on screen when it was an empty one (it would
  // flash "no jobs" while the corrected page loads).
  const showSkeleton = isInitialLoading || isPastLastPage || (isPageLoading && jobs.length === 0);
  const isDetailLoading = showSkeleton || isExtraPending;

  // A job named by the URL counts as opened (clicking a card marks it too).
  const openedId = selectedJob && selectedJob.id === selectedId ? selectedJob.id : null;
  useEffect(() => {
    if (openedId) markViewed(openedId);
  }, [openedId, markViewed]);

  // --- URL updates ---------------------------------------------------------
  // Brings the top of the results back into view after a page or filter
  // change (the page scrolls; the list is not a scroll container).
  const scrollToList = () => {
    const el = listTopRef.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: "start" });
  };

  // Changing any filter, the search or the sort starts over from page 1 and
  // drops the old `selected`, which would point at a job from the old results.
  const updateSearch = (changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([name, value]) => {
      if (value) next.set(name, value);
      else next.delete(name);
    });
    next.delete("page");
    next.delete("selected");
    if (next.toString() === searchParams.toString()) return;
    setSearchParams(next);
    scrollToList();
  };

  const handleSearch = () => {
    updateSearch({ keyword: keyword.trim(), location: location.trim() });
  };

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    updateSearch({ keyword: "", location: "", type: "", industry: "", category: "", sort: "" });
  };

  const setSelectedType = (value: string) => updateSearch({ type: value });
  const setSelectedIndustry = (value: string) => updateSearch({ industry: value });
  const setSelectedCategory = (value: string) => updateSearch({ category: value });

  const setSortBy = (label: string) => {
    const option = sortOptions.find((item) => item.value === label);
    // The default order is left out of the URL.
    updateSearch({ sort: option && option !== sortOptions[0] ? option.key : "" });
  };

  const handlePageChange = (nextPage: number) => {
    const target = Math.min(Math.max(1, nextPage), lastPage);
    if (target === page) return;
    const next = new URLSearchParams(searchParams);
    if (target > 1) next.set("page", String(target));
    else next.delete("page");
    next.delete("selected");
    setSearchParams(next);
    scrollToList();
  };

  const handleCardClick = (job: { id: string }) => {
    // Keep the URL in sync with the selection, preserving the other params.
    const next = new URLSearchParams(searchParams);
    next.set("selected", job.id);
    setSearchParams(next, { replace: true });
  };

  // --- save / share / report -----------------------------------------------
  const toggleSave = async (job: Job) => {
    try {
      const nextSaved = await toggleSaveInList(job);
      if (nextSaved === null) return;
      // A job shown from outside the list is not in the cache; update its copy too.
      setExtra((prev) =>
        prev && prev.job && prev.job.id === job.id ? { ...prev, job: { ...prev.job, saved: nextSaved } } : prev
      );
    } catch {
      // Non-auth failures (e.g. a network error) just leave the saved
      // state unchanged — it only flips after the API call succeeds, so
      // there's nothing to roll back.
    }
  };

  const handleSave = async () => {
    // While a new page loads, the pane still shows the previous page's job.
    if (!selectedJob || isPageLoading) return;
    await toggleSave(selectedJob);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/${selectedJob?.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers that block clipboard
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleOpenReportModal = () => {
    if (!selectedJob || reportedJobIds.has(selectedJob.id)) return;
    setSelectedReportReason("");
    setOtherReportReason("");
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReportReason("");
    setOtherReportReason("");
  };

  const canSubmitReport =
    !!selectedJob &&
    !!selectedReportReason &&
    (selectedReportReason !== OTHER_REPORT_REASON_KEY || !!otherReportReason.trim());

  const handleReport = () => {
    if (!canSubmitReport || !selectedJob) return;
    setReportedJobIds((prev) => new Set(prev).add(selectedJob.id));
    handleCloseReportModal();
    setReportToast(true);
    setTimeout(() => setReportToast(false), 2500);
  };

  const isSelectedJobSaved = selectedJob?.saved ?? false;
  const isSelectedJobReported = selectedJob ? reportedJobIds.has(selectedJob.id) : false;

  // "Showing X–Y of N" for the page on screen.
  const rangeStart = jobs.length > 0 ? (pagination ? (pagination.page - 1) * JOBS_PAGE_SIZE + 1 : 1) : 0;
  const rangeEnd = jobs.length > 0 ? rangeStart + jobs.length - 1 : 0;

  // Read out by the always-mounted live region on the page.
  let statusMessage = "";
  if (showSkeleton || isPageLoading) statusMessage = "Loading jobs";
  else if (!error && total === 0) statusMessage = "No jobs found";
  else if (!error) {
    statusMessage = `${totalPages > 1 ? `Page ${page} of ${totalPages}, showing` : "Showing"} jobs ${rangeStart}–${rangeEnd} of ${total}`;
  }

  return {
    jobs,
    page,
    total,
    totalPages,
    rangeStart,
    rangeEnd,
    statusMessage,
    showSkeleton,
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
    selectedReportReason,
    setSelectedReportReason,
    otherReportReason,
    setOtherReportReason,
    OTHER_REPORT_REASON_KEY,
    isSelectedJobSaved,
    isSelectedJobReported,
    shareToast,
    reportToast,
  };
};
