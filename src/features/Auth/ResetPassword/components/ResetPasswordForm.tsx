import { Link } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import PasswordField from "../../../../components/auth/PasswordField";
import { useResetPasswordFormService } from "../services/useResetPasswordFormService";

const ResetPasswordForm = () => {
  const { form, onSubmit, successMessage } = useResetPasswordFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard title="Reset password" description="Choose a new password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {successMessage && (
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
            {successMessage}
          </p>
        )}

        <PasswordField
          id="password"
          label="New Password"
          placeholder="Enter new password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm new password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
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

export default ResetPasswordForm;
