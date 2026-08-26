import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useJobs } from "../../../hooks/useJobs";
import { sortOptions, OTHER_REPORT_REASON_KEY } from "../../../constants/fieldsKeyValues";

export const useJobsPageService = () => {
  const { jobs, isLoading, error, toggleSave } = useJobs();
  const routeLocation = useLocation();
  const navigate = useNavigate();

  // Search inputs (live)
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // Applied search (on submit)
  const [activeKeyword, setActiveKeyword] = useState("");
  const [activeLocation, setActiveLocation] = useState("");

  // Filters
  const [selectedType, setSelectedType] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState(sortOptions[0].value);
  const [showSort, setShowSort] = useState(false);

  // Mobile panels
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Only the id is kept in state — the job itself is always derived from
  // `filteredJobs` (below) so it automatically reflects updates like
  // toggleSave flipping `saved`, without a separate sync step.
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Share / Report (save is backend-persisted now — see useJobs' toggleSave)
  const [reportedJobIds, setReportedJobIds] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const [reportToast, setReportToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");

  // Driven purely by `?category=` in the URL (set by clicking a category
  // card on the Home/Categories pages) rather than its own local state —
  // there's no dropdown for it, so deriving it directly avoids needing a
  // sync-from-URL effect (and the "fights local changes" bug that pattern
  // caused for job selection — see the effect below) for a value nothing
  // ever changes except the URL itself.
  const selectedCategory = new URLSearchParams(routeLocation.search).get("category") ?? "";

  const isFiltered = !!(activeKeyword || activeLocation || selectedType || selectedIndustry || selectedCategory);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (activeKeyword) {
      const kw = activeKeyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw))
      );
    }
    if (activeLocation)
      result = result.filter((j) =>
        j.location.toLowerCase().includes(activeLocation.toLowerCase())
      );
    // The Job Type dropdown mixes employment type ("Full Time", "Contract")
    // and work arrangement ("On-site", "Remote", "Hybrid") into one list
    // (see jobTypeOptions), so match against either field on the job.
    if (selectedType)
      result = result.filter((j) => j.type === selectedType || j.workArrangement === selectedType);
    if (selectedIndustry) result = result.filter((j) => j.industry === selectedIndustry);
    if (selectedCategory) result = result.filter((j) => j.category === selectedCategory);

    // `jobs` already arrives newest-first (the API's default sort), so
    // "Most Recent" and "Highest Salary" (not yet implemented client-side)
    // both keep that order; "Oldest" is just the reverse of it.
    if (sortBy === "Oldest") result.reverse();
    else if (sortBy === "Most Applicants") result.sort((a, b) => b.applicants - a.applicants);

    return result;
  }, [jobs, activeKeyword, activeLocation, selectedType, selectedIndustry, selectedCategory, sortBy]);

  const selectedJob = useMemo(
    () => filteredJobs.find((job) => job.id === selectedJobId),
    [filteredJobs, selectedJobId]
  );

  useEffect(() => {
    if (!selectedJobId && filteredJobs.length > 0) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  // Applies `?selected=<id>` from the URL (e.g. arriving from the
  // homepage's Featured Jobs) to the selection. Deliberately does NOT
  // depend on selection state — otherwise every manual card click (which
  // changes the selection but not the URL) would re-trigger this effect and
  // immediately snap the selection back to whatever the URL still said,
  // which is exactly what handleCardClick's own URL update below now
  // prevents by keeping the two in sync going forward.
  useEffect(() => {
    const selectedId = new URLSearchParams(routeLocation.search).get("selected");
    if (!selectedId) return;
    if (jobs.some((job) => job.id === selectedId)) {
      setSelectedJobId((current) => (current === selectedId ? current : selectedId));
    }
  }, [routeLocation.search, jobs]);

  const handleSearch = () => {
    setActiveKeyword(keyword);
    setActiveLocation(location);
  };

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setActiveKeyword("");
    setActiveLocation("");
    setSelectedType("");
    setSelectedIndustry("");
    setSortBy(sortOptions[0].value);
    setSelectedCategory("");
  };

  // The category filter lives in the URL rather than its own state (see
  // `selectedCategory` above), so "setting" it means updating the URL —
  // this is what both the dropdown and the chip's clear button call.
  // Preserves other params (e.g. `selected`) instead of overwriting them.
  const setSelectedCategory = (category: string) => {
    const params = new URLSearchParams(routeLocation.search);
    if (category) params.set("category", category);
    else params.delete("category");
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`, { replace: true });
  };

  const handleCardClick = (job: { id: string }) => {
    setSelectedJobId(job.id);
    // Keep the URL in sync with the selection (not just cosmetic — the
    // "sync from URL" effect above compares against this on every route
    // change, so letting it drift is what caused selection to snap back).
    // Preserve any existing params (e.g. `category`) rather than
    // overwriting the whole query string with just `selected`.
    const params = new URLSearchParams(routeLocation.search);
    params.set("selected", job.id);
    navigate(`/jobs?${params.toString()}`, { replace: true });
  };

  const handleSave = async () => {
    if (!selectedJob) return;

    try {
      await toggleSave(selectedJob.id);
    } catch {
      // Non-auth failures (e.g. a network error) just leave the saved
      // state unchanged — toggleSave only flips it after the API call
      // succeeds, so there's nothing to roll back.
    }
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

  return {
    jobs,
    isLoading,
    error,
    filteredJobs,
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
