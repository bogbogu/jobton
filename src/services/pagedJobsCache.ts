import type { Job } from "../types/job-type";
import type { JobsPagination } from "./jobs.service";
import { localAuthTokenStorage } from "./auth.storage";

// Small in-memory cache of recently seen pages of the Find Jobs list, shared
// by everything that needs to read or patch it (usePagedJobs, and
// useSaveJobToggle so a save made on any page reaches cached copies).
const MAX_CACHED_PAGES = 10;
const MAX_SAVE_LOG = 100;

export interface PageEntry {
  key: string;
  searchKey: string;
  jobs: Job[];
  pagination: JobsPagination;
  fetchedAt: number;
}

const cache = new Map<string, PageEntry>();
const listeners = new Set<() => void>();
let version = 0;
let cachedViewer = "";

// Saves/unsaves made since the cache was last reset, oldest first. A page
// request that started before one of these may come back with the old
// `saved` value, so the answer is patched with the toggles it missed.
let saveSeq = 0;
let saveLog: Array<{ seq: number; jobId: string; saved: boolean }> = [];

const emit = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

export const subscribeToPagedJobs = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getPagedJobsVersion = () => version;

export const readCachedPage = (key: string) => cache.get(key);
export const hasCachedPage = (key: string) => cache.has(key);

export const writeCachedPage = (entry: PageEntry) => {
  cache.delete(entry.key);
  cache.set(entry.key, entry);
  while (cache.size > MAX_CACHED_PAGES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
  emit();
};

export const clearPagedJobsCache = () => {
  cache.clear();
  saveLog = [];
  emit();
};

// `saved` is per user, so pages cached for one visitor must never be served
// to another. The cache identity is the stored login token (memory only —
// never logged, rendered or put in a URL), read on every call so a logout
// followed by another login cannot reuse the previous user's pages even when
// the Jobs page was not mounted in between. Returns the key part to use.
export const currentViewerKey = (): string => {
  let viewer = "guest";
  try {
    viewer = localAuthTokenStorage.getToken() ?? "guest";
  } catch {
    // Storage blocked: treat as a guest.
  }
  if (viewer !== cachedViewer) {
    cachedViewer = viewer;
    cache.clear();
    saveLog = [];
  }
  return viewer;
};

export const currentSaveSeq = () => saveSeq;

// Applies the save toggles made after `sinceSeq` to a freshly fetched page.
export const applySavesSince = (jobs: Job[], sinceSeq: number): Job[] => {
  const missed = saveLog.filter((item) => item.seq > sinceSeq);
  if (missed.length === 0) return jobs;
  return jobs.map((job) => {
    const latest = [...missed].reverse().find((item) => item.jobId === job.id);
    return latest ? { ...job, saved: latest.saved } : job;
  });
};

// Updates the job in every cached page.
export const setSavedInCache = (jobId: string, saved: boolean) => {
  saveSeq += 1;
  saveLog = [...saveLog, { seq: saveSeq, jobId, saved }].slice(-MAX_SAVE_LOG);
  cache.forEach((entry, key) => {
    if (entry.jobs.some((job) => job.id === jobId)) {
      cache.set(key, {
        ...entry,
        jobs: entry.jobs.map((job) => (job.id === jobId ? { ...job, saved } : job)),
      });
    }
  });
  emit();
};
