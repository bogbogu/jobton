import { Link } from "react-router-dom";
import type { ChannelKind } from "../../../types/admin-type";
import { useAdminChannelsPageService } from "../services/useAdminChannelsPageService";
import { formatDateTime } from "../utils/safeLinks";
import {
  cardClasses,
  Chip,
  ErrorBanner,
  inputClasses,
  NoticeBanner,
  primaryButton,
  secondaryButton,
  Spinner,
} from "./AdminUi";

const KIND_HELP = "board: one post is about one vacancy. authored: a post may bundle several.";

const AdminChannels = () => {
  const channels = useAdminChannelsPageService();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Telegram channels</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Public channels the ingestion job polls for new vacancies. Channels cannot be deleted; deactivate them instead.
        </p>
      </header>

      <form onSubmit={(event) => void channels.addChannel(event)} noValidate className={`${cardClasses} space-y-3`} aria-labelledby="add-channel-heading">
        <h2 id="add-channel-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Add channel
        </h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
          <div>
            <label htmlFor="channel-username" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Username or t.me link
            </label>
            <input
              id="channel-username"
              type="text"
              value={channels.username}
              onChange={(event) => channels.setUsername(event.target.value)}
              placeholder="@jobchannel or https://t.me/jobchannel"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={Boolean(channels.addError)}
              aria-describedby={channels.addError ? "channel-add-error" : undefined}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="channel-kind" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Kind
            </label>
            <select
              id="channel-kind"
              autoComplete="off"
              value={channels.kind}
              onChange={(event) => channels.setKind(event.target.value as ChannelKind)}
              className={inputClasses}
            >
              <option value="board">board</option>
              <option value="authored">authored</option>
            </select>
          </div>
          <button type="submit" disabled={channels.isAdding} className={primaryButton}>
            {channels.isAdding ? "Adding..." : "Add channel"}
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">{KIND_HELP}</p>
        {channels.addError && (
          <div id="channel-add-error">
            <ErrorBanner>{channels.addError}</ErrorBanner>
          </div>
        )}
        {channels.notice && <NoticeBanner>{channels.notice}</NoticeBanner>}
      </form>

      {channels.isLoading ? (
        <Spinner label="Loading channels..." />
      ) : channels.error ? (
        <div className="space-y-3">
          <ErrorBanner>{channels.error}</ErrorBanner>
          <button type="button" onClick={() => void channels.reload()} className={secondaryButton}>
            Try again
          </button>
        </div>
      ) : channels.channels.length === 0 ? (
        <p className={`${cardClasses} text-center text-sm text-slate-600 dark:text-slate-400`}>
          No channels yet. Add one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {channels.channels.map((channel) => {
            const busy = channels.busyId === channel.id;
            const kindId = `kind-${channel.id}`;

            return (
              <li key={channel.id} className={`${cardClasses} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-all text-base font-semibold text-slate-900 dark:text-white">@{channel.username}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Chip tone={channel.active ? "green" : "slate"}>{channel.active ? "Active" : "Inactive"}</Chip>
                      <Chip tone="blue">{channel.kind}</Chip>
                      {channel.consecutiveFailures > 0 && (
                        <Chip tone="red">
                          {channel.consecutiveFailures} failure{channel.consecutiveFailures === 1 ? "" : "s"} in a row
                        </Chip>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={kindId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Kind
                      </label>
                      <select
                        id={kindId}
                        autoComplete="off"
                        value={channel.kind}
                        disabled={busy}
                        onChange={(event) => void channels.changeKind(channel, event.target.value as ChannelKind)}
                        className={`${inputClasses} w-32`}
                      >
                        <option value="board">board</option>
                        <option value="authored">authored</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void channels.toggleActive(channel)}
                      aria-label={`${channel.active ? "Deactivate" : "Activate"} @${channel.username}`}
                      className={secondaryButton}
                    >
                      {busy ? "Saving..." : channel.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>

                <dl className="flex flex-col gap-x-6 gap-y-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-600 dark:text-slate-400">Last polled:</dt>
                    <dd className="text-slate-800 dark:text-slate-200">{formatDateTime(channel.lastPolledAt)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-600 dark:text-slate-400">Jobs:</dt>
                    <dd className="flex flex-wrap gap-x-4 text-slate-800 dark:text-slate-200">
                      <Link to={`/admin/jobs?channel=${encodeURIComponent(channel.username)}`} className="inline-flex min-h-11 items-center underline underline-offset-2">
                        {channel.jobCounts.pending_review} pending
                      </Link>
                      <Link
                        to={`/admin/jobs?status=published&channel=${encodeURIComponent(channel.username)}`}
                        className="inline-flex min-h-11 items-center underline underline-offset-2"
                      >
                        {channel.jobCounts.published} published
                      </Link>
                      <Link
                        to={`/admin/jobs?status=rejected&channel=${encodeURIComponent(channel.username)}`}
                        className="inline-flex min-h-11 items-center underline underline-offset-2"
                      >
                        {channel.jobCounts.rejected} rejected
                      </Link>
                    </dd>
                  </div>
                </dl>

                {channel.lastError && (
                  <p className="whitespace-pre-wrap break-words rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    Last error: {channel.lastError}
                  </p>
                )}

                {channels.rowError?.id === channel.id && <ErrorBanner>{channels.rowError.message}</ErrorBanner>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminChannels;
