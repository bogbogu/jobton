import { useEffect, useState, useSyncExternalStore } from "react";
import type { Job } from "../types/job-type";
import { jobsService } from "../services/jobs.service";
import {
  type PageEntry,
  applySavesSince,
  currentSaveSeq,
  currentViewerKey,
  getPagedJobsVersion,
  hasCachedPage,
  readCachedPage,
  subscribeToPagedJobs,
  writeCachedPage,
} from "../services/pagedJobsCache";
import { useSaveJobToggle } from "./useSaveJobToggle";

export const JOBS_PAGE_SIZE = 30;

// Server-side paged list for the Find Jobs page. (useJobs still loads every
// job for the pages that need the whole list; this one only ever holds a
// single page.) Recently seen pages are kept in a small module-level cache
// (see pagedJobsCache) so Back / revisiting a page is instant and the next
// page can be fetched ahead of time.
// A cached page older than this is still shown straight away but is
// refreshed in the background.
const CACHE_TTL_MS = 2 * 60 * 1000;

export interface PagedJobsQuery {
  page: number;
  keyword: string;
  location: string;
  type: string;
  industry: string;
  category: string;
  sort: string;
}

// Identifies everything about a query except the page number.
export const filterKeyOf = (query: PagedJobsQuery) => {
  const params = new URLSearchParams();
  (["keyword", "location", "type", "industry", "category", "sort"] as const).forEach((name) => {
    if (query[name]) params.set(name, query[name]);
  });
  return params.toString();
};

const inflight = new Map<string, Promise<PageEntry>>();

// One request per page at a time: a prefetch that is still running is reused
// when the user then asks for that same page.
const requestPage = (key: string, searchKey: string, query: PagedJobsQuery): Promise<PageEntry> => {
  const existing = inflight.get(key);
  if (existing) return existing;

  const startedAtSeq = currentSaveSeq();
  const request = jobsService
    .list({
      page: query.page,
      limit: JOBS_PAGE_SIZE,
      keyword: query.keyword || undefined,
      location: query.location || undefined,
      type: query.type || undefined,
      industry: query.industry || undefined,
      category: query.category || undefined,
      sort: query.sort || undefined,
    })
    .then(({ jobs, pagination }) => {
      // A save/unsave made while this was in flight wins over the old flag.
      const entry: PageEntry = {
        key,
        searchKey,
        jobs: applySavesSince(jobs, startedAtSeq),
        pagination,
        fetchedAt: Date.now(),
      };
      writeCachedPage(entry);
      return entry;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
};

const whenIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 300);
  return () => window.clearTimeout(handle);
};

// --- hook -----------------------------------------------------------------

export const usePagedJobs = (query: PagedJobsQuery) => {
  const saveToggle = useSaveJobToggle();
  const { page, keyword, location, type, industry, category, sort } = query;

  // Keyed on the stored login token (the same thing the API client sends), not
  // the auth context, which only learns the user after a profile request, so
  // one user's cached pages are never served to another.
  const viewer = currentViewerKey();
  const searchKey = `${viewer}|${filterKeyOf({ page, keyword, location, type, industry, category, sort })}`;
  const key = `${searchKey}|${page}`;

  // Re-render whenever the cache changes (a page arrives, a job is saved).
  useSyncExternalStore(subscribeToPagedJobs, getPagedJobsVersion);
  const entry = readCachedPage(key);

  // The page shown most recently: what stays on screen, dimmed, while the
  // next page of the same search is on its way.
  const [last, setLast] = useState<PageEntry | null>(null);
  if (entry && entry !== last) setLast(entry);

  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  // A failure only matters for the page that failed; once the user moves to
  // another page it is forgotten, so coming back to it tries again.
  if (failure && failure.key !== key) setFailure(null);
  const [attempt, setAttempt] = useState(0);
  const hasEntry = !!entry;

  // Load the requested page. A cached page is used as it is (and refreshed
  // quietly once it is old); the `cancelled` flag drops the answer of any
  // request the user has already moved on from, so a slow earlier page can
  // never replace the one they are looking at.
  useEffect(() => {
    let cancelled = false;
    const cached = readCachedPage(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return;

    requestPage(key, searchKey, { page, keyword, location, type, industry, category, sort }).catch((err) => {
      if (cancelled || cached) return;
      setFailure({ key, message: err instanceof Error ? err.message : "Unable to load jobs." });
    });

    return () => {
      cancelled = true;
    };
  }, [key, searchKey, hasEntry, attempt, page, keyword, location, type, industry, category, sort]);

  // Once a page is showing, quietly fetch the one after it.
  const totalPages = entry?.pagination.totalPages ?? 0;
  useEffect(() => {
    if (!hasEntry || page >= totalPages) return;
    const nextKey = `${searchKey}|${page + 1}`;
    if (hasCachedPage(nextKey) || inflight.has(nextKey)) return;

    return whenIdle(() => {
      requestPage(nextKey, searchKey, { page: page + 1, keyword, location, type, industry, category, sort }).catch(() => {
        // Prefetch is best effort; the page loads normally if it is opened.
      });
    });
  }, [hasEntry, totalPages, key, searchKey, page, keyword, location, type, industry, category, sort]);

  const failed = !entry && failure?.key === key ? failure : null;
  const previous = last && last.searchKey === searchKey ? last : null;

  const retry = () => {
    setFailure(null);
    setAttempt((count) => count + 1);
  };

  // Resolves to the new `saved` value, or null when the visitor was sent to
  // log in instead. useSaveJobToggle updates every cached page itself.
  const toggleSave = (job: Job) => saveToggle(job.id, job.saved ?? false);

  return {
    // The page for this query, or (while only the page number changed) the
    // previous page so the list does not blank out.
    jobs: entry?.jobs ?? previous?.jobs ?? [],
    pagination: (entry ?? previous)?.pagination ?? null,
    isLoaded: !!entry,
    // Nothing to show yet for this search: render placeholders.
    isInitialLoading: !entry && !failed && !previous,
    // Only the page changed: keep the old list visible until the new one lands.
    isPageLoading: !entry && !failed && !!previous,
    error: failed?.message ?? null,
    retry,
    toggleSave,
  };
};
