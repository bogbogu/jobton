import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import CompanyLogo from "../../../components/CompanyLogo";
import {
  EMPLOYMENT_TYPES,
  JOB_BADGES,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
  WORK_ARRANGEMENTS,
  type AdminJob,
  type JobBadge,
  type RawPost,
} from "../../../types/admin-type";
import {
  fieldDomId,
  MAX_ABOUT_COMPANY_LENGTH,
  MAX_LIST_ITEM_LENGTH,
  MAX_LIST_ITEMS,
  PHONE_FORMAT_ERROR,
  useAdminJobReviewPageService,
  type FormField,
} from "../services/useAdminJobReviewPageService";
import { normalizeDomain } from "../utils/domain";
import { humanizeField, humanizeWarning } from "../utils/fieldLabels";
import { formatDateTime, normalizePhone, safeHttpUrl } from "../utils/safeLinks";
import { telegramImageUrls } from "../utils/telegramImages";
import {
  cardClasses,
  Chip,
  dangerOutlineButton,
  ErrorBanner,
  inputClasses,
  invalidInputClasses,
  LinkClassBadge,
  NoticeBanner,
  primaryButton,
  secondaryButton,
  Spinner,
} from "./AdminUi";
import ConfirmActionModal from "./ConfirmActionModal";
import ConfirmReasonModal from "./ConfirmReasonModal";
import ExternalLink from "./ExternalLink";

const BADGE_HINTS: Record<JobBadge, string> = {
  verified: "Jobton's trust promise. Only tick this after you have checked that the employer is real.",
  featured: "Highlights the job.",
  urgent: "Marks the job as urgent.",
  new: "Marks the job as new.",
};

interface FieldControlProps {
  id: string;
  className: string;
  autoComplete: "off";
  "aria-invalid": boolean;
  "aria-required"?: boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  name: FormField;
  label: string;
  error?: string;
  highlight?: boolean;
  required?: boolean;
  hint?: string;
  children: (props: FieldControlProps) => ReactNode;
}

const Field = ({ name, label, error, highlight, required, hint, children }: FieldProps) => {
  const id = fieldDomId(name);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const requiredId = `${id}-required`;
  const showRequiredHint = !error && Boolean(highlight);
  const flagged = Boolean(error) || Boolean(highlight);

  const describedBy =
    [error ? errorId : null, hint ? hintId : null, showRequiredHint ? requiredId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-600 dark:text-red-400">
            {" "}
            *
          </span>
        )}
      </label>
      {children({
        id,
        className: `${inputClasses} ${error ? invalidInputClasses : highlight ? "border-amber-400 dark:border-amber-500" : ""}`,
        autoComplete: "off",
        "aria-invalid": flagged,
        "aria-required": required ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {hint}
        </p>
      )}
      {showRequiredHint && (
        <p id={requiredId} className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          Required to publish.
        </p>
      )}
    </div>
  );
};

const LOGO_PREVIEW_DELAY_MS = 400;

/**
 * Live logo preview for the company website field. The typed value is debounced so a
 * request is not fired per keystroke, and an empty or invalid value makes no request
 * (the logo component falls back to the letter avatar). Remounted per domain so the
 * image is fetched again when the domain changes.
 */
const LogoPreview = ({ value, company }: { value: string; company: string }) => {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), LOGO_PREVIEW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [value]);

  const parsed = normalizeDomain(settled);
  const domain = parsed.ok ? parsed.value : "";

  return (
    <div className="shrink-0" title="Logo preview">
      <CompanyLogo key={domain} company={company || undefined} domain={domain || undefined} />
    </div>
  );
};

const StringList = ({
  title,
  items,
  tone,
  format,
}: {
  title: ReactNode;
  items?: string[];
  tone: "red" | "amber" | "slate" | "blue";
  format?: (item: string) => string;
}) => {
  if (!items || items.length === 0) return null;
  const shown = format ? [...new Set(items.map(format))] : items;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {shown.map((item, index) => (
          <li key={`${item}-${index}`} className="max-w-full">
            <Chip tone={tone}>
              <span className="break-words">{item}</span>
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ModelNotes = ({ notes }: { notes?: string[] }) => {
  if (!notes || notes.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI notes (may be wrong)</h3>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
        {notes.map((note, index) => (
          <li key={index} className="whitespace-pre-wrap break-words">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IMAGE_ERROR_TEXT = "Image could not be loaded. Open the original post to see it.";

/** One Telegram post image. Falls back to a muted line if it fails to load. */
const PostImage = ({
  src,
  index,
  total,
  sourceUrl,
}: {
  src: string;
  index: number;
  total: number;
  sourceUrl: string | null;
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        {IMAGE_ERROR_TEXT}
        {sourceUrl && (
          <>
            {" "}
            <ExternalLink href={sourceUrl}>Open on Telegram</ExternalLink>
          </>
        )}
      </p>
    );
  }

  return (
    <figure className="min-w-0 space-y-1">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <img
          src={src}
          alt={`Image from the original Telegram post, ${index + 1} of ${total}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="block max-h-[480px] max-w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700"
        />
      </a>
      <figcaption className="text-xs text-slate-600 dark:text-slate-400">
        Original image
        <span className="sr-only"> (opens the full image in a new tab)</span>
      </figcaption>
    </figure>
  );
};

const PostImages = ({ urls, sourceUrl }: { urls: string[]; sourceUrl: string | null }) => {
  if (urls.length === 0) return null;
  return (
    <div className="min-w-0 space-y-3">
      {urls.map((url, index) => (
        <PostImage key={url} src={url} index={index} total={urls.length} sourceUrl={sourceUrl} />
      ))}
    </div>
  );
};

/** What the system read from the image(s), collapsed by default. Rendered as plain text only. */
const ImageTextDetails = ({ text }: { text: string }) => (
  <details className="min-w-0 rounded-lg border border-slate-200 dark:border-slate-700">
    <summary className="min-h-11 cursor-pointer px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-100">
      Text the system read from the image
    </summary>
    <div className="min-w-0 space-y-2 px-3 pb-3">
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Compare this with the picture. Differences or text you cannot see in the picture are a warning sign.
      </p>
      <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        {text}
      </pre>
    </div>
  </details>
);

const RawPostPanel = ({ job, rawPost }: { job: AdminJob; rawPost: RawPost | null }) => {
  const sourceUrl = safeHttpUrl(job.source.url);
  const imageUrls = telegramImageUrls(job.source.imageUrls);
  const imageText =
    job.extraction.fromImage === true && typeof job.extraction.imageText === "string"
      ? job.extraction.imageText
      : "";
  const imageTextSection = imageText.trim() ? <ImageTextDetails text={imageText} /> : null;

  return (
    <section aria-labelledby="raw-post-heading" className={`${cardClasses} space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="raw-post-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Original post
        </h2>
        {sourceUrl ? (
          <ExternalLink href={sourceUrl}>Open on Telegram</ExternalLink>
        ) : job.source.url ? (
          <span className="text-xs text-slate-600 dark:text-slate-400">Source link not shown (not a valid http(s) URL)</span>
        ) : null}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        {job.source.channel ? `@${job.source.channel} · ` : ""}
        Posted {formatDateTime(rawPost?.postedAt ?? job.source.postedAt)}
      </p>

      {rawPost ? (
        <>
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-800 dark:bg-slate-950 dark:text-slate-200">
            {rawPost.text}
          </pre>

          {imageUrls.length > 0 ? (
            <PostImages urls={imageUrls} sourceUrl={sourceUrl} />
          ) : (
            rawPost.hasImage && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                This post also contains an image. Open it on Telegram to see it.
              </p>
            )
          )}

          {imageTextSection}

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Links in the post</h3>
            {rawPost.links.length === 0 ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">None.</p>
            ) : (
              <ul className="mt-1.5 space-y-1.5 text-sm">
                {rawPost.links.map((link, index) => {
                  const safe = safeHttpUrl(link.href);
                  return (
                    <li key={`${link.href}-${index}`} className="break-all">
                      {link.label && link.label !== link.href && (
                        <span className="mr-2 text-slate-700 dark:text-slate-300">{link.label}</span>
                      )}
                      {safe ? (
                        <ExternalLink href={safe}>{link.href}</ExternalLink>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">{link.href} (not linked)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            The original post is not available (it may have been purged after 90 days).
          </p>
          <PostImages urls={imageUrls} sourceUrl={sourceUrl} />
          {imageTextSection}
        </>
      )}
    </section>
  );
};

/**
 * Approving is irreversible, so Enter inside a text box must never submit the form.
 * Only the explicit buttons approve. Textareas (new lines) and buttons are left alone.
 */
const blockImplicitSubmit = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
    event.preventDefault();
  }
};

const badgeBoxClasses = "h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500";

const AdminJobReview = () => {
  const review = useAdminJobReviewPageService();
  const { job, rawPost, values, fieldErrors, emptyRequired } = review;

  if (review.isLoading) return <Spinner label="Loading job..." />;

  if (review.loadError || !job || !values) {
    return (
      <div className="space-y-3">
        <ErrorBanner>{review.loadError ?? "Unable to load this job."}</ErrorBanner>
        <div className="flex gap-2">
          <button type="button" onClick={() => void review.reload()} className={secondaryButton}>
            Try again
          </button>
          <Link to={review.backToQueuePath} className={secondaryButton}>
            Back to queue
          </Link>
        </div>
      </div>
    );
  }

  const extraction = job.extraction;
  const disabled = review.isSubmitting || !review.isPending;
  const err = (field: FormField) => fieldErrors[field];
  const flag = (field: FormField) => emptyRequired.has(field);
  const applyFlag = review.applyContactMissing || review.applyContactError;
  const normalizedPhone = normalizePhone(values.applyPhone);
  const phoneHint = !values.applyPhone.trim()
    ? "Examples: +2348012345678 or 08012345678."
    : normalizedPhone
      ? `Will be published as ${normalizedPhone}`
      : PHONE_FORMAT_ERROR;
  const domainParse = normalizeDomain(values.domain);
  const domainHint =
    "Used to fetch the company logo. If the logo looks wrong, correct it; leave empty for a placeholder." +
    (domainParse.ok && domainParse.value && domainParse.value !== values.domain.trim()
      ? ` Will be saved as ${domainParse.value}.`
      : "");
  const approveNextLabel = review.badges.has("verified") ? "Approve as verified & next" : "Approve & next";
  const otherBadges = JOB_BADGES.filter((badge) => badge !== "verified");

  return (
    <div className="min-w-0 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={review.backToQueuePath}
            className="inline-flex min-h-11 items-center text-sm text-blue-600 underline underline-offset-2 dark:text-blue-400"
          >
            &larr; Back to queue
          </Link>
          <h1 className="break-words text-2xl font-bold text-slate-900 dark:text-white">
            Review job<span className="sr-only">: {job.title}</span>
          </h1>
        </div>
        <Chip tone={job.reviewStatus === "published" ? "green" : job.reviewStatus === "rejected" ? "red" : "amber"}>
          {job.reviewStatus.replace("_", " ")}
        </Chip>
      </header>

      {review.notice && <NoticeBanner>{review.notice}</NoticeBanner>}

      {review.postApproveError && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <ErrorBanner>{review.postApproveError}</ErrorBanner>
          </div>
          <Link to={review.backToQueuePath} className={primaryButton}>
            Back to queue
          </Link>
        </div>
      )}

      {!review.isPending && (
        <NoticeBanner>
          This job is {job.reviewStatus.replace("_", " ")} and can no longer be approved or rejected here.
          {job.reviewStatus === "rejected" && job.review.rejectionReason ? ` Reason: ${job.review.rejectionReason}` : ""}
        </NoticeBanner>
      )}

      {job.review.restoredAt && review.isPending && (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Moved back to pending{job.review.restoredFromStatus ? ` from ${job.review.restoredFromStatus.replace("_", " ")}` : ""} on{" "}
          {formatDateTime(job.review.restoredAt)}.
        </p>
      )}

      {review.canRestore ? (
        <div>
          <button
            type="button"
            onClick={review.openRestoreModal}
            disabled={review.isSubmitting}
            className={`${secondaryButton} w-full sm:w-auto`}
          >
            Move back to pending
          </button>
        </div>
      ) : (
        review.isRestorable && (
          <p className="text-xs text-slate-600 dark:text-slate-400">Only a superadmin can move this back to pending.</p>
        )
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-5">
          <RawPostPanel job={job} rawPost={rawPost} />

          <section aria-labelledby="extraction-heading" className={`${cardClasses} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="extraction-heading" className="text-lg font-bold text-slate-900 dark:text-white">
                Extraction checks
              </h2>
              <LinkClassBadge linkClass={extraction.linkClass} />
            </div>

            <StringList title="Automatic warnings" items={extraction.redFlags} tone="red" format={humanizeWarning} />
            <StringList title="Still missing" items={extraction.missing} tone="amber" format={humanizeField} />
            <StringList
              title="Values the AI had to interpret - double-check"
              items={extraction.corrections}
              tone="blue"
            />
            <StringList
              title="Fields dropped (failed validation)"
              items={extraction.droppedFields}
              tone="slate"
              format={humanizeField}
            />
            <ModelNotes notes={extraction.modelNotes} />

            {!extraction.redFlags?.length &&
              !extraction.missing?.length &&
              !extraction.corrections?.length &&
              !extraction.droppedFields?.length &&
              !extraction.modelNotes?.length && (
                <p className="text-sm text-slate-600 dark:text-slate-400">Nothing to report.</p>
              )}
          </section>
        </div>

        {/* No submit button on purpose: only the explicit Approve buttons can publish. */}
        <form
          onSubmit={(event) => event.preventDefault()}
          onKeyDown={blockImplicitSubmit}
          noValidate
          aria-labelledby="edit-heading"
          className={`${cardClasses} space-y-4`}
        >
          <h2 id="edit-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Extracted fields
          </h2>

          {extraction.fromImage === true && (
            <NoticeBanner role="note">
              Part of this job was read from an image. Check names, phone numbers, emails and links against the picture
              before approving.
            </NoticeBanner>
          )}

          <fieldset disabled={disabled} className="min-w-0 space-y-4 pb-2">
            <Field name="title" label="Title" required error={err("title")} highlight={flag("title")}>
              {(p) => <input {...p} type="text" maxLength={200} value={values.title} onChange={(e) => review.setField("title", e.target.value)} />}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="company" label="Company" required error={err("company")} highlight={flag("company")}>
                {(p) => <input {...p} type="text" maxLength={200} value={values.company} onChange={(e) => review.setField("company", e.target.value)} />}
              </Field>
              <Field name="location" label="Location" required error={err("location")} highlight={flag("location")}>
                {(p) => <input {...p} type="text" maxLength={200} value={values.location} onChange={(e) => review.setField("location", e.target.value)} />}
              </Field>
            </div>

            <Field name="category" label="Category" required error={err("category")} highlight={flag("category")}>
              {(p) => <input {...p} type="text" maxLength={100} value={values.category} onChange={(e) => review.setField("category", e.target.value)} />}
            </Field>

            <Field name="domain" label="Company website" error={err("domain")} hint={domainHint}>
              {(p) => (
                <div className="flex items-center gap-3">
                  <input
                    {...p}
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="e.g. acme.com"
                    className={`${p.className} min-w-0 flex-1`}
                    value={values.domain}
                    onChange={(e) => review.setField("domain", e.target.value)}
                    onBlur={() => {
                      // Tidy a pasted URL into the plain hostname that will be saved.
                      if (domainParse.ok && domainParse.value !== values.domain) {
                        review.setField("domain", domainParse.value);
                      }
                    }}
                  />
                  <LogoPreview value={values.domain} company={values.company.trim()} />
                </div>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="employmentType" label="Employment type" error={err("employmentType")}>
                {(p) => (
                  <select {...p} value={values.employmentType} onChange={(e) => review.setField("employmentType", e.target.value)}>
                    <option value="">Not set</option>
                    {EMPLOYMENT_TYPES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field name="workArrangement" label="Work arrangement" error={err("workArrangement")}>
                {(p) => (
                  <select {...p} value={values.workArrangement} onChange={(e) => review.setField("workArrangement", e.target.value)}>
                    <option value="">Not set</option>
                    {WORK_ARRANGEMENTS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="salaryMin" label="Salary min" error={err("salaryMin")}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 150000"
                    value={values.salaryMin}
                    onChange={(e) => review.setField("salaryMin", e.target.value)}
                  />
                )}
              </Field>
              <Field name="salaryMax" label="Salary max" error={err("salaryMax")}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 250000"
                    value={values.salaryMax}
                    onChange={(e) => review.setField("salaryMax", e.target.value)}
                  />
                )}
              </Field>
              <Field name="salaryCurrency" label="Currency" error={err("salaryCurrency")}>
                {(p) => (
                  <select {...p} value={values.salaryCurrency} onChange={(e) => review.setField("salaryCurrency", e.target.value)}>
                    {SALARY_CURRENCIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field name="salaryPeriod" label="Salary period" error={err("salaryPeriod")}>
                {(p) => (
                  <select {...p} value={values.salaryPeriod} onChange={(e) => review.setField("salaryPeriod", e.target.value)}>
                    <option value="">Not stated</option>
                    {SALARY_PERIODS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <Field name="skills" label="Skills" error={err("skills")} hint="Comma separated.">
              {(p) => <input {...p} type="text" value={values.skills} onChange={(e) => review.setField("skills", e.target.value)} />}
            </Field>

            <Field name="description" label="Description" required error={err("description")} highlight={flag("description")}>
              {(p) => (
                <textarea {...p} rows={10} maxLength={10000} value={values.description} onChange={(e) => review.setField("description", e.target.value)} />
              )}
            </Field>

            <Field
              name="aboutCompany"
              label="About the company"
              error={err("aboutCompany")}
              hint={`Optional. Shown on the job page. Up to ${MAX_ABOUT_COMPANY_LENGTH} characters.`}
            >
              {(p) => (
                <textarea
                  {...p}
                  rows={5}
                  maxLength={MAX_ABOUT_COMPANY_LENGTH}
                  value={values.aboutCompany}
                  onChange={(e) => review.setField("aboutCompany", e.target.value)}
                />
              )}
            </Field>

            <Field
              name="requirements"
              label="Requirements"
              error={err("requirements")}
              hint={`Optional. One item per line, up to ${MAX_LIST_ITEMS} items of ${MAX_LIST_ITEM_LENGTH} characters.`}
            >
              {(p) => (
                <textarea
                  {...p}
                  rows={6}
                  value={values.requirements}
                  onChange={(e) => review.setField("requirements", e.target.value)}
                />
              )}
            </Field>

            <Field
              name="benefits"
              label="Benefits"
              error={err("benefits")}
              hint={`Optional. One item per line, up to ${MAX_LIST_ITEMS} items of ${MAX_LIST_ITEM_LENGTH} characters.`}
            >
              {(p) => (
                <textarea
                  {...p}
                  rows={6}
                  value={values.benefits}
                  onChange={(e) => review.setField("benefits", e.target.value)}
                />
              )}
            </Field>

            <fieldset
              aria-describedby="apply-group-hint"
              className={`min-w-0 space-y-4 rounded-xl border p-3 ${
                review.applyContactError
                  ? "border-red-400 dark:border-red-600"
                  : applyFlag
                    ? "border-amber-300 dark:border-amber-600"
                    : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <legend
                className={`px-1 text-sm font-medium ${
                  review.applyContactError ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                How to apply{" "}
                <span aria-hidden="true" className="text-red-600 dark:text-red-400">
                  *
                </span>
              </legend>
              <p
                id="apply-group-hint"
                className={`text-xs ${
                  applyFlag ? "text-amber-700 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                At least one of link, email or phone is required to publish.
                {applyFlag && " None is set yet."}
              </p>
              <Field name="applicationLink" label="Application link" error={err("applicationLink")}>
                {(p) => (
                  <input
                    {...p}
                    type="url"
                    inputMode="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={values.applicationLink}
                    onChange={(e) => review.setField("applicationLink", e.target.value)}
                  />
                )}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="applyEmail" label="Apply email" error={err("applyEmail")}>
                  {(p) => (
                    <input
                      {...p}
                      type="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={values.applyEmail}
                      onChange={(e) => review.setField("applyEmail", e.target.value)}
                    />
                  )}
                </Field>
                <Field name="applyPhone" label="Apply phone" error={err("applyPhone")} hint={err("applyPhone") ? undefined : phoneHint}>
                  {(p) => (
                    <input
                      {...p}
                      type="tel"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={values.applyPhone}
                      onChange={(e) => review.setField("applyPhone", e.target.value)}
                    />
                  )}
                </Field>
              </div>
            </fieldset>

            <fieldset className="min-w-0 space-y-2">
              <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">Badges</legend>

              <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 dark:border-amber-700 dark:bg-amber-950/30">
                <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2.5 text-sm text-amber-950 dark:text-amber-100">
                  <input
                    type="checkbox"
                    checked={review.badges.has("verified")}
                    onChange={() => review.toggleBadge("verified")}
                    className={`mt-0.5 ${badgeBoxClasses}`}
                  />
                  <span>
                    <span className="font-semibold">Verified employer</span>
                    <span className="block text-xs text-amber-900 dark:text-amber-200">{BADGE_HINTS.verified}</span>
                  </span>
                </label>
              </div>

              {otherBadges.map((badge) => (
                <label
                  key={badge}
                  className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={review.badges.has(badge)}
                    onChange={() => review.toggleBadge(badge)}
                    className={`mt-0.5 ${badgeBoxClasses}`}
                  />
                  <span>
                    <span className="font-medium capitalize">{badge}</span>
                    <span className="block text-xs text-slate-600 dark:text-slate-400">{BADGE_HINTS[badge]}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          </fieldset>

          {review.isPending && (
            <div className="sticky bottom-0 z-20 -mx-4 -mb-4 space-y-3 rounded-b-2xl border-t border-slate-200 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_12px_-6px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
              {review.formError && <ErrorBanner>{review.formError}</ErrorBanner>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-2 sm:flex-1">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => void review.approve("approveNext")}
                    className={`${primaryButton} flex-1 sm:flex-none`}
                  >
                    {review.isSubmitting ? "Working..." : approveNextLabel}
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => void review.approve("approve")}
                    className={`${secondaryButton} flex-1 sm:flex-none`}
                  >
                    Approve
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 dark:border-slate-700">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={review.openRejectModal}
                    className={`${dangerOutlineButton} w-full sm:w-auto`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {review.showRestoreModal && (
        <ConfirmActionModal
          title="Move this job back to pending?"
          confirmLabel="Move back to pending"
          isSubmitting={review.isSubmitting}
          error={review.restoreError}
          onConfirm={() => void review.confirmRestore()}
          onCancel={review.closeRestoreModal}
        >
          <p>This returns the job to the review queue so it can be reviewed again.</p>
          {job.reviewStatus === "published" && (
            <p className="font-medium">
              The job will be removed from the public site until it is approved again.
            </p>
          )}
        </ConfirmActionModal>
      )}

      {review.showRejectModal && (
        <ConfirmReasonModal
          title="Reject this job?"
          description="The job will stay hidden from the public. You can add a short reason for the record."
          confirmLabel="Reject job"
          isSubmitting={review.isSubmitting}
          error={review.rejectError}
          onConfirm={(reason) => void review.confirmReject(reason)}
          onCancel={review.closeRejectModal}
        />
      )}
    </div>
  );
};

export default AdminJobReview;
