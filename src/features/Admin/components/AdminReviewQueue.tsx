import { Link } from "react-router-dom";
import { REVIEW_STATUSES, type ReviewStatus } from "../../../types/admin-type";
import { useAdminReviewQueuePageService } from "../services/useAdminReviewQueuePageService";
import { humanizeFields } from "../utils/fieldLabels";
import { formatRelative } from "../utils/safeLinks";
import {
  cardClasses,
  Chip,
  ErrorBanner,
  inputClasses,
  LinkClassBadge,
  NoticeBanner,
  secondaryButton,
  Spinner,
} from "./AdminUi";
import ConfirmReasonModal from "./ConfirmReasonModal";

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending_review: "Pending",
  published: "Published",
  rejected: "Rejected",
};

const AdminReviewQueue = () => {
  const queue = useAdminReviewQueuePageService();
  const {
    status,
    channel,
    jobs,
    pagination,
    isLoading,
    error,
    pendingCount,
    channelOptions,
    selected,
  } = queue;

  const emptyLabel =
    status === "pending_review"
      ? "Nothing is waiting for review."
      : `No ${STATUS_LABELS[status].toLowerCase()} jobs${channel ? " for this channel" : ""}.`;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 tabIndex={-1} className="text-2xl font-bold text-slate-900 focus:outline-none dark:text-white">
            Review queue
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Jobs imported from Telegram wait here until you approve them.
          </p>
        </div>
        <p className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Pending: {pendingCount === null ? "-" : pendingCount}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Show jobs by status" className="flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {REVIEW_STATUSES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={status === item}
              onClick={() => queue.setStatus(item)}
              className={`min-h-11 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                status === item
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {STATUS_LABELS[item]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="admin-channel-filter" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Channel
          </label>
          <select
            id="admin-channel-filter"
            value={channel}
            onChange={(event) => queue.setChannel(event.target.value)}
            autoComplete="off"
            className={`${inputClasses} sm:w-52`}
          >
            <option value="">All channels</option>
            {channelOptions.map((username) => (
              <option key={username} value={username}>
                @{username}
              </option>
            ))}
            {channel && !channelOptions.includes(channel) && <option value={channel}>@{channel}</option>}
          </select>
        </div>
      </div>

      {queue.notice && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <NoticeBanner>{queue.notice}</NoticeBanner>
          </div>
          <button
            type="button"
            onClick={queue.dismissNotice}
            className="min-h-11 shrink-0 px-3 text-sm text-slate-600 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {queue.canSelect && jobs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={queue.allSelected}
              onChange={queue.toggleAll}
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Select all on this page
          </label>
          <button
            type="button"
            onClick={queue.openBulkModal}
            disabled={selected.size === 0}
            className={secondaryButton}
          >
            Reject selected ({selected.size})
          </button>
        </div>
      )}

      {isLoading ? (
        <Spinner label="Loading jobs..." />
      ) : error ? (
        <div className="space-y-3">
          <ErrorBanner>{error}</ErrorBanner>
          <button type="button" onClick={() => void queue.reload()} className={secondaryButton}>
            Try again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <p className={`${cardClasses} text-center text-sm text-slate-600 dark:text-slate-400`}>{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => {
            const redFlags = job.extraction.redFlags ?? [];
            const missing = job.extraction.missing ?? [];
            const titleId = `job-title-${job.id}`;

            const reviewState = { channel };
            const missingLabels = humanizeFields(missing);

            return (
              <li key={job.id} className={`${cardClasses} relative flex gap-2 transition hover:border-blue-300 dark:hover:border-blue-700`}>
                {queue.canSelect && (
                  // Sits above the stretched title link so the checkbox stays separately tappable.
                  <label className="relative z-10 -my-1 -ml-2 flex min-h-11 min-w-11 shrink-0 cursor-pointer items-start justify-center pt-2.5">
                    <input
                      type="checkbox"
                      checked={selected.has(job.id)}
                      onChange={() => queue.toggleSelected(job.id)}
                      aria-label={`Select ${job.title || "Untitled"} for rejection`}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <h2 id={titleId} className="break-words text-base font-semibold text-slate-900 dark:text-white">
                      <Link
                        to={`/admin/jobs/${job.id}`}
                        state={reviewState}
                        className="rounded-2xl after:absolute after:inset-0 after:rounded-2xl hover:underline focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-blue-500"
                      >
                        {job.title || "Untitled"}
                        <span className="sr-only">{status === "pending_review" ? " - review" : " - view"}</span>
                      </Link>
                    </h2>
                    <p className="break-words text-sm text-slate-600 dark:text-slate-300">
                      {job.company || <span className="italic text-slate-600 dark:text-slate-400">Company not listed</span>}
                      {" · "}
                      {job.location || <span className="italic text-slate-600 dark:text-slate-400">Location not listed</span>}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {job.source.channel ? `@${job.source.channel} · ` : ""}
                      Ingested {formatRelative(job.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <LinkClassBadge linkClass={job.extraction.linkClass} />
                    {job.extraction.fromImage === true && <Chip tone="blue">Image</Chip>}
                    {redFlags.length > 0 && (
                      <Chip tone="red">
                        {redFlags.length} warning{redFlags.length === 1 ? "" : "s"}
                      </Chip>
                    )}
                    {missingLabels.map((label) => (
                      <Chip key={label} tone="amber">
                        Missing: {label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <span aria-hidden="true" className="hidden shrink-0 self-center text-sm font-semibold text-blue-600 dark:text-blue-400 sm:block">
                  {status === "pending_review" ? "Review" : "View"} &rarr;
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => queue.setPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className={secondaryButton}
          >
            Previous
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} jobs)
          </p>
          <button
            type="button"
            onClick={() => queue.setPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className={secondaryButton}
          >
            Next
          </button>
        </nav>
      )}

      {queue.showBulkModal && (
        <ConfirmReasonModal
          title={`Reject ${selected.size} job${selected.size === 1 ? "" : "s"}?`}
          description="The selected jobs will be rejected and stay hidden from the public. This cannot be undone from this screen."
          confirmLabel="Reject jobs"
          isSubmitting={queue.isBulkRejecting}
          error={queue.bulkError}
          onConfirm={(reason) => void queue.confirmBulkReject(reason)}
          onCancel={queue.closeBulkModal}
        />
      )}
    </div>
  );
};

export default AdminReviewQueue;
