import { Link, Navigate } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import SocialLoginButton from "../../../../components/auth/SocialLoginButton";
import Divider from "../../../../components/auth/Divider";
import AuthInput from "../../../../components/auth/AuthInput";
import PasswordField from "../../../../components/auth/PasswordField";
import { useRegisterFormService } from "../services/useRegisterFormService";

const RegisterForm = () => {
  const { form, onSubmit, isAuthenticated, isAuthLoading, authError } = useRegisterFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthCard
      title="Create account"
      description="Create your Jobton account in a few steps."
      logoPlacement="outside"
    >
      <div className="space-y-3">
        <SocialLoginButton provider="Google" />
        <SocialLoginButton provider="LinkedIn" />
      </div>

      <Divider label="or" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {authError && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {authError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthInput
            id="firstName"
            label="First Name"
            type="text"
            placeholder="John"
            registration={register("firstName")}
            error={errors.firstName?.message}
            autoComplete="given-name"
          />

          <AuthInput
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="Doe"
            registration={register("lastName")}
            error={errors.lastName?.message}
            autoComplete="family-name"
          />
        </div>

        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          registration={register("email")}
          error={errors.email?.message}
          autoComplete="email"
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Create your password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="space-y-1">
          <label className="inline-flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 dark:border-slate-600"
            />
            <span>I agree to the Terms &amp; Conditions.</span>
          </label>
          {errors.acceptTerms?.message && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.acceptTerms.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isAuthLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting || isAuthLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Login
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterForm;
