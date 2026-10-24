import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAdminChannels } from "../../../hooks/useAdminChannels";
import { adminService } from "../../../services/admin.service";
import {
  REVIEW_STATUSES,
  type AdminJob,
  type AdminPagination,
  type ReviewStatus,
} from "../../../types/admin-type";

const PAGE_SIZE = 20;

const parseStatus = (value: string | null): ReviewStatus =>
  REVIEW_STATUSES.find((status) => status === value) ?? "pending_review";

// A hand-typed ?page=100000000 must not be taken at face value.
const MAX_PAGE = 10000;

const parsePage = (value: string | null) => {
  const page = parseInt(value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? Math.min(page, MAX_PAGE) : 1;
};

const readNotice = (state: unknown): string | null => {
  if (typeof state === "object" && state !== null && "notice" in state) {
    const value = (state as { notice: unknown }).notice;
    return typeof value === "string" ? value : null;
  }
  return null;
};

interface ListResult {
  key: string;
  jobs: AdminJob[];
  pagination: AdminPagination | null;
  error: string | null;
}

export const useAdminReviewQueuePageService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const status = parseStatus(searchParams.get("status"));
  const channel = (searchParams.get("channel") ?? "").toLowerCase();
  const page = parsePage(searchParams.get("page"));

  const { channels } = useAdminChannels();

  // `version` is bumped to force a reload (retry, after bulk reject).
  const [version, setVersion] = useState(0);
  const listKey = `${status}|${channel}|${page}`;
  const requestKey = `${listKey}|${version}`;

  const [result, setResult] = useState<ListResult | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  const [selection, setSelection] = useState<{ key: string; ids: string[] }>({ key: listKey, ids: [] });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isBulkRejecting, setIsBulkRejecting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(() => readNotice(location.state));

  useEffect(() => {
    let cancelled = false;

    adminService
      .listJobs({ reviewStatus: status, channel: channel || undefined, page, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setResult({ key: requestKey, jobs: response.jobs, pagination: response.pagination, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          jobs: [],
          pagination: null,
          error: err instanceof Error ? err.message : "Unable to load jobs.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [status, channel, page, requestKey]);

  useEffect(() => {
    let cancelled = false;

    adminService
      .listJobs({ reviewStatus: "pending_review", limit: 1 })
      .then((response) => {
        if (!cancelled) setPendingCount(response.pagination.total);
      })
      .catch(() => {
        if (!cancelled) setPendingCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const isLoading = result?.key !== requestKey;
  const jobs = useMemo(() => (isLoading ? [] : (result?.jobs ?? [])), [isLoading, result]);
  const pagination = isLoading ? null : (result?.pagination ?? null);
  const error = isLoading ? null : (result?.error ?? null);

  // Past the last page (typed URL, or the last job of a page was just rejected): jump
  // straight to the real last page in one step instead of walking back page by page.
  const totalPages = pagination?.totalPages;
  useEffect(() => {
    if (!isLoading && !error && jobs.length === 0 && page > 1) {
      const target = Math.min(page - 1, Math.max(1, totalPages ?? 1));
      const params = new URLSearchParams(searchParams);
      if (target > 1) params.set("page", String(target));
      else params.delete("page");
      setSearchParams(params, { replace: true });
    }
  }, [isLoading, error, jobs.length, page, totalPages, searchParams, setSearchParams]);

  // Selection belongs to one visible page; it is ignored once the page/filter changes.
  const selectedIds = useMemo(
    () => (selection.key === listKey ? selection.ids : []),
    [selection, listKey]
  );
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const updateParams = useCallback(
    (next: { status?: ReviewStatus; channel?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams);
      if (next.status !== undefined) {
        if (next.status === "pending_review") params.delete("status");
        else params.set("status", next.status);
      }
      if (next.channel !== undefined) {
        if (next.channel) params.set("channel", next.channel);
        else params.delete("channel");
      }
      if (next.page !== undefined && next.page > 1) params.set("page", String(next.page));
      else params.delete("page");
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const setStatus = (next: ReviewStatus) => updateParams({ status: next, page: 1 });
  const setChannel = (next: string) => updateParams({ channel: next, page: 1 });
  const setPage = (next: number) => updateParams({ page: next });

  const toggleSelected = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelection({ key: listKey, ids: [...next] });
  };

  const allSelected = jobs.length > 0 && jobs.every((job) => selected.has(job.id));

  const toggleAll = () => {
    setSelection({ key: listKey, ids: allSelected ? [] : jobs.map((job) => job.id) });
  };

  const openBulkModal = () => {
    setBulkError(null);
    setShowBulkModal(true);
  };

  const closeBulkModal = () => {
    if (!isBulkRejecting) setShowBulkModal(false);
  };

  const confirmBulkReject = async (reason: string) => {
    const ids = selectedIds;
    if (ids.length === 0) return;

    setIsBulkRejecting(true);
    setBulkError(null);

    try {
      const response = await adminService.bulkReject(ids, reason || undefined);
      setShowBulkModal(false);
      setSelection({ key: listKey, ids: [] });
      setNotice(
        response.rejected === ids.length
          ? `${response.rejected} job(s) rejected.`
          : `${response.rejected} of ${ids.length} job(s) rejected. The rest were no longer pending.`
      );
      setVersion((current) => current + 1);
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "Unable to reject the selected jobs.");
    } finally {
      setIsBulkRejecting(false);
    }
  };

  const channelOptions = useMemo(() => channels.map((item) => item.username), [channels]);

  return {
    status,
    channel,
    page,
    jobs,
    pagination,
    isLoading,
    error,
    pendingCount,
    channelOptions,
    selected,
    allSelected,
    showBulkModal,
    isBulkRejecting,
    bulkError,
    notice,
    canSelect: status === "pending_review",
    setStatus,
    setChannel,
    setPage,
    toggleSelected,
    toggleAll,
    openBulkModal,
    closeBulkModal,
    confirmBulkReject,
    dismissNotice: () => setNotice(null),
    reload: () => setVersion((current) => current + 1),
  };
};
