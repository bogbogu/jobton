import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AdminApiError, adminService } from "../../../services/admin.service";
import type {
  AdminJob,
  AdminJobEdits,
  JobBadge,
  RawPost,
} from "../../../types/admin-type";
import { humanizeFields } from "../utils/fieldLabels";
import { isValidEmailShape, normalizePhone, safeHttpUrl } from "../utils/safeLinks";

export const FORM_FIELDS = [
  "title",
  "company",
  "location",
  "category",
  "employmentType",
  "workArrangement",
  "salaryMin",
  "salaryMax",
  "salaryCurrency",
  "salaryPeriod",
  "skills",
  "description",
  "applicationLink",
  "applyEmail",
  "applyPhone",
] as const;

export type FormField = (typeof FORM_FIELDS)[number];
export type FormValues = Record<FormField, string>;
export type FieldErrors = Partial<Record<FormField, string>>;

/** Fields that must be filled before a job can be published. */
export const REQUIRED_TO_PUBLISH: FormField[] = ["title", "description", "company", "location", "category"];
export const APPLY_FIELDS: FormField[] = ["applicationLink", "applyEmail", "applyPhone"];

export const PHONE_FORMAT_ERROR = "Use digits only, e.g. +2348012345678 or 08012345678";
const SALARY_FORMAT_ERROR = "Use whole numbers only, e.g. 150000 (commas are fine).";
const SALARY_ORDER_ERROR = "The maximum salary must be at least the minimum.";
const REQUIRED_ERROR = "Required to publish.";

/** DOM id of a form control, so errors can focus and scroll to the right one. */
export const fieldDomId = (field: FormField) => `review-field-${field}`;

const isFormField = (value: string): value is FormField => (FORM_FIELDS as readonly string[]).includes(value);

const numberToString = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? String(value) : "";

export const toFormValues = (job: AdminJob): FormValues => ({
  title: job.title ?? "",
  company: job.company ?? "",
  location: job.location ?? "",
  category: job.category ?? "",
  employmentType: job.employmentType ?? "",
  workArrangement: job.workArrangement ?? "",
  salaryMin: numberToString(job.salaryMin),
  salaryMax: numberToString(job.salaryMax),
  salaryCurrency: job.salaryCurrency || "NGN",
  salaryPeriod: job.salaryPeriod ?? "",
  skills: (job.skills ?? []).join(", "),
  description: job.description ?? "",
  applicationLink: job.applicationLink ?? "",
  applyEmail: job.applyEmail ?? "",
  applyPhone: job.applyPhone ?? "",
});

const parseSkills = (value: string) => {
  const seen = new Set<string>();
  const skills: string[] = [];
  for (const part of value.split(",")) {
    const skill = part.trim();
    if (skill && !seen.has(skill.toLowerCase())) {
      seen.add(skill.toLowerCase());
      skills.push(skill);
    }
  }
  return skills;
};

type SalaryParse = { ok: true; value: number | null } | { ok: false };

/**
 * "150,000" -> 150000, "" -> null (no salary). Anything that is not a
 * non-negative whole number is rejected; a typed value is never silently cleared.
 */
export const parseSalary = (raw: string): SalaryParse => {
  const cleaned = raw.replace(/[,\s]/g, "");
  if (cleaned === "") return { ok: true, value: null };
  if (!/^\d+$/.test(cleaned)) return { ok: false };
  const value = Number(cleaned);
  return Number.isSafeInteger(value) ? { ok: true, value } : { ok: false };
};

const TEXT_FIELDS: FormField[] = [
  "title",
  "company",
  "location",
  "category",
  "description",
  "applicationLink",
  "applyEmail",
  "applyPhone",
];
const NULLABLE_ENUM_FIELDS: FormField[] = ["employmentType", "workArrangement", "salaryPeriod"];

const normalizeText = (field: FormField, value: string) =>
  field === "applyPhone" ? (normalizePhone(value) ?? value.trim()) : value.trim();

/** Only the fields that differ from what the admin loaded. Call only after validation passed. */
export const buildEdits = (initial: FormValues, current: FormValues): AdminJobEdits => {
  const edits: Record<string, unknown> = {};

  for (const field of TEXT_FIELDS) {
    const next = normalizeText(field, current[field]);
    if (next !== normalizeText(field, initial[field])) edits[field] = next;
  }

  for (const field of NULLABLE_ENUM_FIELDS) {
    if (current[field] !== initial[field]) edits[field] = current[field] || null;
  }

  if (current.salaryCurrency !== initial.salaryCurrency) edits.salaryCurrency = current.salaryCurrency;

  for (const field of ["salaryMin", "salaryMax"] as const) {
    const next = parseSalary(current[field]);
    const before = parseSalary(initial[field]);
    if (next.ok && (!before.ok || next.value !== before.value)) edits[field] = next.value;
  }

  const initialSkills = parseSkills(initial.skills);
  const currentSkills = parseSkills(current.skills);
  if (initialSkills.join("\u0000") !== currentSkills.join("\u0000")) edits.skills = currentSkills;

  return edits as AdminJobEdits;
};

interface LocalCheck {
  errors: FieldErrors;
  /** None of link / email / phone is filled in. */
  applyContactMissing: boolean;
}

/** Client-side checks that mirror the backend rules, for fast feedback only. */
const validateLocally = (values: FormValues): LocalCheck => {
  const errors: FieldErrors = {};

  for (const field of REQUIRED_TO_PUBLISH) {
    if (!values[field].trim()) errors[field] = REQUIRED_ERROR;
  }

  const min = parseSalary(values.salaryMin);
  const max = parseSalary(values.salaryMax);
  if (!min.ok) errors.salaryMin = SALARY_FORMAT_ERROR;
  if (!max.ok) errors.salaryMax = SALARY_FORMAT_ERROR;
  if (min.ok && max.ok && min.value !== null && max.value !== null && min.value > max.value) {
    errors.salaryMax = SALARY_ORDER_ERROR;
  }

  const link = values.applicationLink.trim();
  if (link && !safeHttpUrl(link)) {
    errors.applicationLink = "Must be a valid http(s) URL without a username or password.";
  }

  const email = values.applyEmail.trim();
  if (email && !isValidEmailShape(email)) errors.applyEmail = "Must be a valid email address.";

  if (values.applyPhone.trim() && !normalizePhone(values.applyPhone)) {
    errors.applyPhone = PHONE_FORMAT_ERROR;
  }

  return {
    errors,
    applyContactMissing: APPLY_FIELDS.every((field) => !values[field].trim()),
  };
};

/** "Please fill in: Company, Location. Please check: Salary." */
const describeProblems = (missingKeys: string[], invalidKeys: string[]) => {
  const parts: string[] = [];
  if (missingKeys.length > 0) parts.push(`Please fill in: ${humanizeFields(missingKeys).join(", ")}.`);
  if (invalidKeys.length > 0) parts.push(`Please check: ${humanizeFields(invalidKeys).join(", ")}.`);
  return parts.join(" ");
};

/** The first problem field in the order the form shows them. */
const firstProblemField = (errors: FieldErrors, applyContact: boolean): FormField | null => {
  for (const field of FORM_FIELDS) {
    if (errors[field]) return field;
    if (applyContact && field === "applicationLink") return field;
  }
  return null;
};

type SubmitMode = "approve" | "approveNext";

const readNotice = (state: unknown): string | null => {
  if (typeof state === "object" && state !== null && "notice" in state) {
    const value = (state as { notice: unknown }).notice;
    return typeof value === "string" ? value : null;
  }
  return null;
};

const CHANNEL_PATTERN = /^[A-Za-z0-9_]{1,64}$/;

/** The queue's channel filter the admin came from, carried in router state. */
const readChannel = (state: unknown): string => {
  if (typeof state === "object" && state !== null && "channel" in state) {
    const value = (state as { channel: unknown }).channel;
    if (typeof value === "string" && CHANNEL_PATTERN.test(value)) return value.toLowerCase();
  }
  return "";
};

const withNotice = (notice: string, channel: string) => ({ state: { notice, channel } });

type NextLookup = { kind: "found"; id: string } | { kind: "empty" } | { kind: "failed" };

const NEXT_PAGE_SIZE = 50;

const createdTime = (job: AdminJob) => {
  const time = Date.parse(job.createdAt);
  return Number.isNaN(time) ? 0 : time;
};

/** Queue order is newest first (createdAt desc, id desc): is `candidate` after `current` in it? */
const comesAfter = (candidate: AdminJob, current: AdminJob) => {
  const a = createdTime(candidate);
  const b = createdTime(current);
  return a < b || (a === b && candidate.id < current.id);
};

/**
 * The pending job that follows `current` in the queue the admin came from (same
 * channel filter, same order). If `current` was the last one it wraps to the newest
 * pending job. The approved job is no longer in the pending list, so its position is
 * found by binary searching the pages on createdAt.
 */
const lookupNextPending = async (current: AdminJob, channel: string): Promise<NextLookup> => {
  const fetchPage = (page: number) =>
    adminService.listJobs({
      reviewStatus: "pending_review",
      channel: channel || undefined,
      page,
      limit: NEXT_PAGE_SIZE,
    });

  try {
    const first = await fetchPage(1);
    if (first.jobs.length === 0) return { kind: "empty" };

    let low = 1;
    let high = Math.max(1, first.pagination.totalPages);
    let lowJobs = first.jobs;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const { jobs } = await fetchPage(mid);
      if (jobs.length > 0 && comesAfter(jobs[jobs.length - 1], current)) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    if (low !== 1) lowJobs = (await fetchPage(low)).jobs;

    const next =
      lowJobs.find((job) => job.id !== current.id && comesAfter(job, current)) ??
      first.jobs.find((job) => job.id !== current.id);

    return next ? { kind: "found", id: next.id } : { kind: "empty" };
  } catch {
    return { kind: "failed" };
  }
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useAdminJobReviewPageService = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const arrivalNotice = readNotice(location.state);
  const channel = readChannel(location.state);
  const backToQueuePath = channel ? `/admin/jobs?channel=${encodeURIComponent(channel)}` : "/admin/jobs";

  const [job, setJob] = useState<AdminJob | null>(null);
  const [rawPost, setRawPost] = useState<RawPost | null>(null);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [values, setValues] = useState<FormValues | null>(null);
  const [badges, setBadges] = useState<Set<JobBadge>>(new Set());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [postApproveError, setPostApproveError] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState<{ id: string; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [applyContactError, setApplyContactError] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Focus + scroll to the first problem field once the form is enabled again.
  const pendingFocus = useRef<FormField | null>(null);
  const [focusTick, setFocusTick] = useState(0);

  const requestFocus = (field: FormField | null) => {
    if (!field) return;
    pendingFocus.current = field;
    setFocusTick((current) => current + 1);
  };

  useEffect(() => {
    if (isSubmitting || !pendingFocus.current) return;
    const element = document.getElementById(fieldDomId(pendingFocus.current));
    pendingFocus.current = null;
    if (!element) return;
    element.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    element.focus({ preventScroll: true });
  }, [focusTick, isSubmitting]);

  const applyLoaded = useCallback((loadedJob: AdminJob, loadedPost: RawPost | null) => {
    const formValues = toFormValues(loadedJob);
    setJob(loadedJob);
    setRawPost(loadedPost);
    setInitialValues(formValues);
    setValues(formValues);
    setBadges(new Set());
    setFieldErrors({});
    setApplyContactError(false);
    setFormError(null);
    setPostApproveError(null);
  }, []);

  // Bumped to force a reload (retry, stale job). Loading is derived from it:
  // the data is "loading" until a result exists for the current id + version.
  const [version, setVersion] = useState(0);
  const loadKey = `${id}|${version}`;
  const [loaded, setLoaded] = useState<{ key: string; error: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminService
      .getJob(id)
      .then((response) => {
        if (cancelled) return;
        applyLoaded(response.job, response.rawPost);
        setLoaded({ key: loadKey, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setJob(null);
        setValues(null);
        setLoaded({
          key: loadKey,
          error:
            err instanceof AdminApiError && err.status === 404
              ? "This job was not found."
              : err instanceof Error
                ? err.message
                : "Unable to load this job.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id, loadKey, applyLoaded]);

  const isLoading = loaded?.key !== loadKey;
  const loadError = isLoading ? null : (loaded?.error ?? null);
  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const setField = (field: FormField, value: string) => {
    setValues((previous) => (previous ? { ...previous, [field]: value } : previous));
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
    if (APPLY_FIELDS.includes(field)) setApplyContactError(false);
  };

  const toggleBadge = (badge: JobBadge) => {
    setBadges((previous) => {
      const next = new Set(previous);
      if (next.has(badge)) next.delete(badge);
      else next.add(badge);
      return next;
    });
  };

  const isPending = job?.reviewStatus === "pending_review";

  // Warn before closing the tab or reloading with unsaved edits. (BrowserRouter has
  // no in-app navigation blocker, so this only covers leaving the site.)
  const isDirty = useMemo(() => {
    if (!isPending || !values || !initialValues) return false;
    return badges.size > 0 || FORM_FIELDS.some((field) => values[field] !== initialValues[field]);
  }, [isPending, values, initialValues, badges]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  /** Required-to-publish fields that are currently empty (for highlighting). */
  const emptyRequired = useMemo(() => {
    if (!values) return new Set<FormField>();
    const empty = new Set<FormField>();
    for (const field of REQUIRED_TO_PUBLISH) {
      if (!values[field].trim()) empty.add(field);
    }
    return empty;
  }, [values]);

  const applyContactMissing = useMemo(() => {
    if (!values) return false;
    return APPLY_FIELDS.every((field) => !values[field].trim());
  }, [values]);

  /** Shows the problems (inline and in the banner) and moves focus to the first one. */
  const showProblems = (errors: FieldErrors, applyContact: boolean, banner: string) => {
    setFieldErrors(errors);
    setApplyContactError(applyContact);
    setFormError(banner);
    requestFocus(firstProblemField(errors, applyContact));
  };

  const applyServerError = (error: AdminApiError): boolean => {
    if (error.code === "MISSING_FIELDS") {
      const next: FieldErrors = {};
      let contact = false;
      for (const key of error.missing) {
        if (key === "applyContact") contact = true;
        else if (isFormField(key)) next[key] = REQUIRED_ERROR;
      }
      showProblems(next, contact, describeProblems(error.missing, []) || error.message);
      return true;
    }

    if (error.code === "VALIDATION_ERROR") {
      const next: FieldErrors = {};
      const unmapped: string[] = [];
      for (const [path, message] of Object.entries(error.fields)) {
        const root = path.split(".")[0];
        if (isFormField(root)) next[root] = message;
        else unmapped.push(message);
      }
      const banner =
        describeProblems([], Object.keys(next)) ||
        (unmapped.length ? unmapped.join(" ") : "Some fields are not valid. Check the highlighted fields.");
      showProblems(next, false, banner);
      return true;
    }

    return false;
  };

  const approve = async (mode: SubmitMode) => {
    if (!job || !values || !initialValues || isSubmitting) return;

    // Check everything we can before bothering the server.
    const check = validateLocally(values);
    const problemFields = Object.keys(check.errors);
    if (problemFields.length > 0 || check.applyContactMissing) {
      const missing = problemFields.filter((field) => check.errors[field as FormField] === REQUIRED_ERROR);
      const invalid = problemFields.filter((field) => !missing.includes(field));
      if (check.applyContactMissing) missing.push("applyContact");
      showProblems(check.errors, check.applyContactMissing, describeProblems(missing, invalid));
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    setApplyContactError(false);

    try {
      await adminService.approveJob(job.id, {
        edits: buildEdits(initialValues, values),
        status: [...badges],
        // Exactly as received, so the backend can detect edits made after we loaded.
        expectedUpdatedAt: job.updatedAt,
      });

      if (mode === "approve") {
        navigate(backToQueuePath, withNotice("Job approved and published.", channel));
        return;
      }

      const next = await lookupNextPending(job, channel);
      if (next.kind === "found") {
        navigate(
          `/admin/jobs/${next.id}`,
          withNotice("Job approved and published. Here is the next pending job.", channel)
        );
      } else if (next.kind === "empty") {
        navigate(backToQueuePath, withNotice("Job approved and published. No more pending jobs.", channel));
      } else {
        // The job IS published; do not leave the form open as if it could be approved again.
        setJob((previous) => (previous ? { ...previous, reviewStatus: "published" } : previous));
        setPostApproveError("Approved, but could not load the next job.");
      }
    } catch (err) {
      if (!(err instanceof AdminApiError)) {
        setFormError("Something went wrong. Please try again.");
        return;
      }

      if (err.status === 409 && err.code === "NOT_PENDING") {
        navigate(backToQueuePath, withNotice("That job was already handled by someone else.", channel));
        return;
      }

      if (err.status === 409 && err.code === "STALE") {
        reload();
        setLocalNotice({
          id: job.id,
          text: "This job changed after you opened it. It has been reloaded; please review it again.",
        });
        return;
      }

      if (err.status === 400 && applyServerError(err)) return;

      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = () => {
    setRejectError(null);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    if (!isSubmitting) setShowRejectModal(false);
  };

  const confirmReject = async (reason: string) => {
    if (!job) return;

    setIsSubmitting(true);
    setRejectError(null);

    try {
      await adminService.rejectJob(job.id, reason || undefined);
      navigate(backToQueuePath, withNotice("Job rejected.", channel));
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 409 && err.code === "NOT_PENDING") {
        navigate(backToQueuePath, withNotice("That job was already handled by someone else.", channel));
        return;
      }
      setRejectError(err instanceof Error ? err.message : "Unable to reject this job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    job,
    rawPost,
    values,
    badges,
    isLoading,
    loadError,
    isSubmitting,
    isPending,
    formError,
    postApproveError,
    backToQueuePath,
    notice: localNotice && localNotice.id === id ? localNotice.text : arrivalNotice,
    fieldErrors,
    applyContactError,
    applyContactMissing,
    emptyRequired,
    showRejectModal,
    rejectError,
    setField,
    toggleBadge,
    approve,
    openRejectModal,
    closeRejectModal,
    confirmReject,
    reload,
  };
};
