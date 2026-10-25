import axios, { type AxiosRequestConfig } from "axios";
import { privateAccess } from "../api/api";
import type {
  AdminJobDetailResponse,
  AdminJobsListParams,
  AdminJobsListResponse,
  ApproveJobPayload,
  ApproveJobResponse,
  BulkRejectResponse,
  ChannelResponse,
  ChannelsListResponse,
  CreateChannelPayload,
  RestoreJobPayload,
  RestoreJobResponse,
  UpdateChannelPayload,
} from "../types/admin-type";

/**
 * Error thrown by the admin service. Unlike the shared main* helpers, it keeps
 * the HTTP status and the structured fields of the backend error body so the
 * UI can react to MISSING_FIELDS, VALIDATION_ERROR, NOT_PENDING, STALE, ...
 */
export class AdminApiError extends Error {
  status: number | null;
  code: string | null;
  missing: string[];
  fields: Record<string, string>;

  constructor(
    message: string,
    details: {
      status?: number | null;
      code?: string | null;
      missing?: string[];
      fields?: Record<string, string>;
    } = {}
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = details.status ?? null;
    this.code = details.code ?? null;
    this.missing = details.missing ?? [];
    this.fields = details.fields ?? {};
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toAdminError = (error: unknown, fallback: string): AdminApiError => {
  if (error instanceof AdminApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const data: unknown = error.response?.data;

    if (!error.response) {
      return new AdminApiError("Network error. Check your connection and try again.", { status });
    }

    if (isObject(data)) {
      const message = typeof data.message === "string" && data.message.trim() ? data.message : fallback;
      const code = typeof data.error === "string" ? data.error : null;
      const missing = Array.isArray(data.missing)
        ? data.missing.filter((item): item is string => typeof item === "string")
        : [];
      const fields: Record<string, string> = {};
      if (isObject(data.fields)) {
        for (const [key, value] of Object.entries(data.fields)) {
          if (typeof value === "string") fields[key] = value;
        }
      }
      return new AdminApiError(message, { status, code, missing, fields });
    }

    return new AdminApiError(fallback, { status });
  }

  return new AdminApiError(error instanceof Error && error.message ? error.message : fallback);
};

const request = async <T>(
  config: AxiosRequestConfig,
  fallback: string
): Promise<T> => {
  try {
    const response = await privateAccess.request<T>(config);

    if (typeof response.data === "undefined") {
      throw new AdminApiError("Response data is missing.", { status: response.status });
    }

    return response.data;
  } catch (error) {
    throw toAdminError(error, fallback);
  }
};

const JOB_ID_PATTERN = /^[a-f0-9]{24}$/;

export const isJobId = (value: string): boolean => JOB_ID_PATTERN.test(value);

// Fails fast (as a 404, like the backend would) instead of sending a malformed id.
const assertJobId = (id: string): void => {
  if (!isJobId(id)) throw new AdminApiError("This job was not found.", { status: 404 });
};

export const adminService = {
  listJobs: (params: AdminJobsListParams) =>
    request<AdminJobsListResponse>(
      { method: "GET", url: "/api/admin/jobs", params },
      "Unable to load jobs."
    ),

  getJob: async (id: string) => {
    assertJobId(id);
    return request<AdminJobDetailResponse>(
      { method: "GET", url: `/api/admin/jobs/${id}` },
      "Unable to load this job."
    );
  },

  approveJob: async (id: string, payload: ApproveJobPayload) => {
    assertJobId(id);
    return request<ApproveJobResponse>(
      { method: "POST", url: `/api/admin/jobs/${id}/approve`, data: payload },
      "Unable to approve this job."
    );
  },

  rejectJob: async (id: string, reason?: string) => {
    assertJobId(id);
    return request<ApproveJobResponse>(
      {
        method: "POST",
        url: `/api/admin/jobs/${id}/reject`,
        data: reason ? { reason } : {},
      },
      "Unable to reject this job."
    );
  },

  /** Superadmin only: moves a rejected or published job back to pending review. */
  restoreJob: async (id: string, payload: RestoreJobPayload = {}) => {
    assertJobId(id);
    return request<RestoreJobResponse>(
      {
        method: "POST",
        url: `/api/admin/jobs/${id}/restore`,
        data: payload.expectedUpdatedAt ? { expectedUpdatedAt: payload.expectedUpdatedAt } : {},
      },
      "Unable to move this job back to pending."
    );
  },

  bulkReject: async (ids: string[], reason?: string) => {
    ids.forEach(assertJobId);
    return request<BulkRejectResponse>(
      {
        method: "POST",
        url: "/api/admin/jobs/bulk-reject",
        data: reason ? { ids, reason } : { ids },
      },
      "Unable to reject the selected jobs."
    );
  },

  listChannels: () =>
    request<ChannelsListResponse>(
      { method: "GET", url: "/api/admin/telegram-channels" },
      "Unable to load channels."
    ),

  createChannel: (payload: CreateChannelPayload) =>
    request<ChannelResponse>(
      { method: "POST", url: "/api/admin/telegram-channels", data: payload },
      "Unable to add this channel."
    ),

  updateChannel: (id: string, payload: UpdateChannelPayload) =>
    request<ChannelResponse>(
      {
        method: "PATCH",
        url: `/api/admin/telegram-channels/${encodeURIComponent(id)}`,
        data: payload,
      },
      "Unable to update this channel."
    ),
};
