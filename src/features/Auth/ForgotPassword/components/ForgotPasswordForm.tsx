import { Link } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import AuthInput from "../../../../components/auth/AuthInput";
import { useForgotPasswordFormService } from "../services/useForgotPasswordFormService";

const ForgotPasswordForm = () => {
  const { form, onSubmit, successMessage } = useForgotPasswordFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard title="Forgot password" description="Enter your email and we will send a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {successMessage && (
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
            {successMessage}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
};

export default ForgotPasswordForm;
