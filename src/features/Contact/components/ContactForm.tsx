import { useEffect, useRef } from "react";
import { CONTACT_LIMITS, type ContactField } from "../../../constants/contactLimits";
import { useContactFormService } from "../services/useContactFormService";

const CONTROL_CLASS =
    "w-full min-w-0 rounded-md border bg-white dark:bg-slate-700 text-base text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

interface ContactFieldProps {
    name: ContactField;
    label: string;
    value: string;
    error?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: "text" | "email";
    autoComplete?: string;
    multiline?: boolean;
}

const ContactFieldControl = ({
    name,
    label,
    value,
    error,
    placeholder,
    onChange,
    type = "text",
    autoComplete,
    multiline = false,
}: ContactFieldProps) => {
    const limit = CONTACT_LIMITS[name];
    const atLimit = value.length >= limit;
    const counterId = `${name}-counter`;
    const errorId = `${name}-error`;

    const sharedProps = {
        id: name,
        name,
        value,
        onChange,
        placeholder,
        maxLength: limit,
        autoComplete,
        "aria-required": true as const,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${counterId} ${errorId}` : counterId,
    };
    const stateClass = error
        ? "border-red-400 dark:border-red-500"
        : "border-gray-300 dark:border-slate-600";

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={name} className="dark:text-slate-300">
                {label}
                <span aria-hidden="true" className="text-red-600 dark:text-red-400"> *</span>
                <span className="sr-only"> (required)</span>
            </label>
            {multiline ? (
                <textarea {...sharedProps} rows={6} className={`${CONTROL_CLASS} ${stateClass} resize-none`} />
            ) : (
                <input {...sharedProps} type={type} className={`${CONTROL_CLASS} ${stateClass} min-h-11`} />
            )}
            <div className="flex items-start justify-between gap-3">
                <p id={errorId} aria-live="polite" className="min-w-0 flex-1 text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
                <p
                    id={counterId}
                    className={`shrink-0 text-right ${multiline ? "text-sm font-medium" : "text-xs"} ${atLimit ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                    {value.length} / {limit}
                    <span className="sr-only"> characters</span>
                </p>
            </div>
        </div>
    );
};

const ContactForm = () => {
    const { formData, errors, notice, isSending, handleChange, handleSubmit } = useContactFormService();
    const noticeRef = useRef<HTMLDivElement>(null);

    // The banners sit above the button; on a phone they can be off screen.
    useEffect(() => {
        if (notice) noticeRef.current?.scrollIntoView({ block: "nearest" });
    }, [notice]);

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-8 space-y-6"
        >
            <div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">Leave us a message</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Fields marked <span aria-hidden="true" className="text-red-600 dark:text-red-400">*</span>
                    <span className="sr-only">with an asterisk</span> are required.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContactFieldControl
                    name="name"
                    label="Your Name"
                    value={formData.name}
                    error={errors.name}
                    placeholder="Name"
                    autoComplete="name"
                    onChange={handleChange}
                />
                <ContactFieldControl
                    name="email"
                    label="Your Email"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    placeholder="Email"
                    autoComplete="email"
                    onChange={handleChange}
                />
            </div>

            <ContactFieldControl
                name="subject"
                label="Subject"
                value={formData.subject}
                error={errors.subject}
                placeholder="Subject"
                onChange={handleChange}
            />

            <ContactFieldControl
                name="message"
                label="Message"
                value={formData.message}
                error={errors.message}
                placeholder="Message"
                multiline
                onChange={handleChange}
            />

            {/* Honeypot: off-screen, inert and hidden from assistive tech. Bots fill it, people never see it. */}
            <div aria-hidden="true" inert className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                <input
                    name="reference_code"
                    type="text"
                    value={formData.reference_code}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div ref={noticeRef}>
                {/* Always rendered so assistive tech registers the live region before it has content. */}
                <div role="status">
                    {notice?.type === "success" && (
                        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
                            {notice.message}
                        </p>
                    )}
                </div>
                {notice?.type === "error" && (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                    >
                        {notice.message}
                    </p>
                )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                We keep your message for 90 days so we can reply, and we use it for nothing else.
            </p>

            <button
                type="submit"
                aria-disabled={isSending}
                className="min-h-11 w-full sm:w-auto rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
            >
                {isSending ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
};

export default ContactForm;
