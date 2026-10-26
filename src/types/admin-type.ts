export const REVIEW_STATUSES = ["pending_review", "published", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Temporary",
  "Freelance",
] as const;
export const WORK_ARRANGEMENTS = ["On-site", "Remote", "Hybrid"] as const;
export const SALARY_CURRENCIES = ["NGN", "USD"] as const;
export const SALARY_PERIODS = ["hour", "month", "year"] as const;
export const JOB_BADGES = ["verified", "featured", "urgent", "new"] as const;
export type JobBadge = (typeof JOB_BADGES)[number];

export type LinkClass =
  | "ats"
  | "company_domain"
  | "form"
  | "social_or_short"
  | "other_domain"
  | "none";

export interface AdminJobExtraction {
  model?: string;
  corrections?: string[];
  modelNotes?: string[];
  redFlags?: string[];
  linkClass?: LinkClass | string;
  missing?: string[];
  droppedFields?: string[];
  post?: string | null;
}

export interface AdminJobSource {
  kind: string | null;
  channel: string | null;
  messageId: number | null;
  url: string | null;
  postedAt: string | null;
}

export interface AdminJobReview {
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  /** Set when a superadmin moved the job back to pending. */
  restoredAt: string | null;
  restoredFromStatus: ReviewStatus | null;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  category: string | null;
  /** Company website hostname (e.g. acme.com); '' when none. Used to fetch the logo. */
  domain?: string | null;
  description: string;
  skills: string[];
  status: string[];
  employmentType: string | null;
  workArrangement: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
  applicationLink: string | null;
  applyEmail: string | null;
  applyPhone: string | null;
  aboutCompany?: string | null;
  requirements?: string[] | null;
  benefits?: string[] | null;
  reviewStatus: ReviewStatus;
  review: AdminJobReview;
  source: AdminJobSource;
  extraction: AdminJobExtraction;
  createdAt: string;
  updatedAt: string;
}

export interface RawPostLink {
  href: string;
  label: string;
}

export interface RawPost {
  text: string;
  links: RawPostLink[];
  hasImage: boolean;
  postedAt: string | null;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminJobsListParams {
  reviewStatus?: ReviewStatus;
  channel?: string;
  page?: number;
  limit?: number;
}

export interface AdminJobsListResponse {
  message: string;
  jobs: AdminJob[];
  pagination: AdminPagination;
}

export interface AdminJobDetailResponse {
  message: string;
  job: AdminJob;
  rawPost: RawPost | null;
}

/** Only the fields an admin may change while approving. */
export interface AdminJobEdits {
  title?: string;
  company?: string;
  location?: string;
  category?: string;
  domain?: string;
  employmentType?: string | null;
  workArrangement?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  salaryPeriod?: string | null;
  skills?: string[];
  description?: string;
  applicationLink?: string;
  applyEmail?: string;
  applyPhone?: string;
  aboutCompany?: string;
  requirements?: string[];
  benefits?: string[];
}

export interface ApproveJobPayload {
  edits: AdminJobEdits;
  status: JobBadge[];
  expectedUpdatedAt: string;
}

export interface ApproveJobResponse {
  message: string;
  job: AdminJob;
}

export interface RestoreJobPayload {
  expectedUpdatedAt?: string;
}

/** Handled defensively: the job may be missing from the response. */
export interface RestoreJobResponse {
  message?: string;
  job?: AdminJob;
}

export type ChannelKind = "board" | "authored";

export interface ChannelJobCounts {
  pending_review: number;
  published: number;
  rejected: number;
}

export interface TelegramChannel {
  id: string;
  username: string;
  kind: ChannelKind;
  active: boolean;
  lastPolledAt: string | null;
  lastMessageId?: number;
  consecutiveFailures: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  jobCounts: ChannelJobCounts;
}

export interface ChannelsListResponse {
  message: string;
  channels: TelegramChannel[];
}

export interface ChannelResponse {
  message: string;
  channel: TelegramChannel;
}

export interface CreateChannelPayload {
  username: string;
  kind: ChannelKind;
}

export interface UpdateChannelPayload {
  active?: boolean;
  kind?: ChannelKind;
}

export interface BulkRejectResponse {
  message: string;
  rejected: number;
}
