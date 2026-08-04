import { Link } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import AuthInput from "../../../../components/auth/AuthInput";
import { useVerifyEmailFormService } from "../services/useVerifyEmailFormService";

const VerifyEmailForm = () => {
  const {
    form,
    onSubmit,
    resendVerificationEmail,
    successMessage,
    errorMessage,
    autoVerifyStatus,
    autoVerifyMessage,
    isResending,
  } = useVerifyEmailFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard title="Verify your email" description="Enter the verification code sent to your inbox.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {autoVerifyMessage && (
          <p
            role={autoVerifyStatus === "error" ? "alert" : "status"}
            className={`rounded-lg px-3 py-2 text-sm ${
              autoVerifyStatus === "error"
                ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                : autoVerifyStatus === "success"
                  ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300"
                  : "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
            }`}
          >
            {autoVerifyMessage}
          </p>
        )}

        {successMessage && (
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          registration={register("email")}
          error={errors.email?.message}
          autoComplete="email"
        />

        <AuthInput
          id="code"
          label="Verification Code"
          type="text"
          placeholder="123456"
          registration={register("code")}
          error={errors.code?.message}
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting || autoVerifyStatus === "loading"}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={() => {
              void resendVerificationEmail();
            }}
            disabled={isResending || autoVerifyStatus === "loading"}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isResending ? "Resending..." : "Resend verification email"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Back to{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Login
        </Link>
      </p>
    </AuthCard>
  );
};

export default VerifyEmailForm;
