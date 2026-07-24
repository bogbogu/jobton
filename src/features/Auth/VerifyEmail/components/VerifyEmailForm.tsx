import { Link } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import AuthInput from "../../../../components/auth/AuthInput";
import { useVerifyEmailFormService } from "../services/useVerifyEmailFormService";

const VerifyEmailForm = () => {
  const { form, onSubmit, successMessage, errorMessage } = useVerifyEmailFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard title="Verify your email" description="Enter the verification code sent to your inbox.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          id="code"
          label="Verification Code"
          type="text"
          placeholder="Enter code"
          registration={register("code")}
          error={errors.code?.message}
          autoComplete="one-time-code"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Did not receive a code?{" "}
        <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Resend
        </Link>
      </p>
    </AuthCard>
  );
};

export default VerifyEmailForm;
