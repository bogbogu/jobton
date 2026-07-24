import { Link, Navigate } from "react-router-dom";
import AuthCard from "../../../../components/auth/AuthCard";
import SocialLoginButton from "../../../../components/auth/SocialLoginButton";
import Divider from "../../../../components/auth/Divider";
import AuthInput from "../../../../components/auth/AuthInput";
import PasswordField from "../../../../components/auth/PasswordField";
import { useLoginFormService } from "../services/useLoginFormService";

const LoginForm = () => {
  const { form, onSubmit, nextPath, isAuthenticated, isAuthLoading, authError } = useLoginFormService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (isAuthenticated) {
    return <Navigate to={nextPath ?? "/"} replace />;
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue where you left off."
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
          placeholder="Enter your password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 dark:border-slate-600"
            />
            Remember me
          </label>

          <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isAuthLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting || isAuthLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginForm;
