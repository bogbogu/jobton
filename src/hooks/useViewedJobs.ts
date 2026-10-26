import { useCallback, useState } from "react";

const STORAGE_KEY = "jobton:viewed-jobs";
const MAX_VIEWED = 500;

// Most recent first. Storage can be missing, blocked, full or hold junk
// (private windows, cleared site data, hand-edited values), so every access
// is wrapped and falls back to "nothing viewed" rather than throwing.
const readViewed = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_VIEWED)
      : [];
  } catch {
    return [];
  }
};

const writeViewed = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable — the marker still works for this page view.
  }
};

// Remembers which jobs the visitor has opened so the list can show them as
// already seen. Purely a convenience: nothing here is sent to the server.
export const useViewedJobs = () => {
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => new Set(readViewed()));

  const markViewed = useCallback((jobId: string) => {
    if (!jobId) return;
    // Re-read so ids stored by another tab are not overwritten.
    const next = [jobId, ...readViewed().filter((id) => id !== jobId)].slice(0, MAX_VIEWED);
    writeViewed(next);
    setViewedIds((prev) => (prev.has(jobId) ? prev : new Set(prev).add(jobId)));
  }, []);

  return { viewedIds, markViewed };
};
