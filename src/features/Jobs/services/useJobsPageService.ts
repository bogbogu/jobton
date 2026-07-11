import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs, type Job } from "../../../hooks/useJobs";
import { sortOptions } from "../../../constants/fieldsKeyValues";

export const useJobsPageService = () => {
  const { jobs } = useJobs();
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

  // Selected job
  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);

  // Save / Share / Report
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [reportedJobIds, setReportedJobIds] = useState<Set<number>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const [reportToast, setReportToast] = useState(false);

  const isFiltered = !!(activeKeyword || activeLocation || selectedType || selectedIndustry);

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
    if (selectedType) result = result.filter((j) => j.type === selectedType);
    if (selectedIndustry) result = result.filter((j) => j.industry === selectedIndustry);

    if (sortBy === "Oldest") result.sort((a, b) => a.id - b.id);
    else if (sortBy === "Most Applicants") result.sort((a, b) => b.applicants - a.applicants);
    else result.sort((a, b) => b.id - a.id);

    return result;
  }, [jobs, activeKeyword, activeLocation, selectedType, selectedIndustry, sortBy]);

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
  };

  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
    navigate(`/jobs/${job.id}`);
  };

  const handleSave = () => {
    if (!selectedJob) return;
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(selectedJob.id)) next.delete(selectedJob.id);
      else next.add(selectedJob.id);
      return next;
    });
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

  const handleReport = () => {
    if (!selectedJob || reportedJobIds.has(selectedJob.id)) return;
    setReportedJobIds((prev) => new Set(prev).add(selectedJob.id));
    setReportToast(true);
    setTimeout(() => setReportToast(false), 2500);
  };

  const isSelectedJobSaved = selectedJob ? savedJobIds.has(selectedJob.id) : false;
  const isSelectedJobReported = selectedJob ? reportedJobIds.has(selectedJob.id) : false;

  return {
    jobs,
    filteredJobs,
    keyword, setKeyword,
    location, setLocation,
    selectedType, setSelectedType,
    selectedIndustry, setSelectedIndustry,
    sortBy, setSortBy,
    showSort, setShowSort,
    showMobileFilters, setShowMobileFilters,
    showMobileSort, setShowMobileSort,
    selectedJob, setSelectedJob,
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
  };
};
