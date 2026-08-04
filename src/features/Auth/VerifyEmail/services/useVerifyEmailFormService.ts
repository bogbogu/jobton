import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../../../services/auth.service";

const verifyEmailSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  code: z
    .string()
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits."),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

type AutoVerifyStatus = "idle" | "loading" | "success" | "error";

const normalizeVerificationError = (error: unknown) => {
  const fallback = "Unable to verify your email right now. Please try again.";
  const networkFallback = "Network error. Check your internet connection and try again.";

  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.trim();
  const normalized = message.toLowerCase();

  if (!message) return fallback;

  if (normalized.includes("network") || normalized.includes("failed to fetch") || normalized.includes("timeout")) {
    return networkFallback;
  }

  if (
    (normalized.includes("invalid") && normalized.includes("token")) ||
    normalized.includes("token is invalid")
  ) {
    return "Invalid token. Please request a new verification email.";
  }

  if (normalized.includes("expired") && normalized.includes("token")) {
    return "Expired token. Please request a new verification email.";
  }

  if (
    (normalized.includes("invalid") && normalized.includes("code")) ||
    normalized.includes("verification code")
  ) {
    return "Invalid verification code. Please check the 6-digit code and try again.";
  }

  if (normalized.includes("already") && normalized.includes("verified")) {
    return "This email is already verified. You can log in now.";
  }

  return message;
};

export const useVerifyEmailFormService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoVerifyStatus, setAutoVerifyStatus] = useState<AutoVerifyStatus>("idle");
  const [autoVerifyMessage, setAutoVerifyMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const hasAutoVerified = useRef(false);
  const redirectTimerRef = useRef<number | null>(null);

  const params = new URLSearchParams(location.search);
  const token = params.get("token")?.trim() ?? "";
  const queryEmail = params.get("email")?.trim() ?? "";
  const stateEmail = (location.state as { email?: string } | null)?.email?.trim() ?? "";
  const initialEmail = queryEmail || stateEmail;

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      code: "",
    },
    mode: "onBlur",
  });

  const scheduleRedirectToLogin = () => {
    if (redirectTimerRef.current) {
      window.clearTimeout(redirectTimerRef.current);
    }

    redirectTimerRef.current = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1800);
  };

  useEffect(() => {
    if (!token || hasAutoVerified.current) {
      return;
    }

    hasAutoVerified.current = true;
    setAutoVerifyStatus("loading");
    setAutoVerifyMessage("Verifying your email token...");
    setSuccessMessage(null);
    setErrorMessage(null);

    const verify = async () => {
      try {
        await authService.verifyEmail({ token });
        setAutoVerifyStatus("success");
        setAutoVerifyMessage("Email verified successfully.");
        setSuccessMessage("Email verified successfully. Redirecting to login...");
        scheduleRedirectToLogin();
      } catch (error) {
        setAutoVerifyStatus("error");
        setAutoVerifyMessage(normalizeVerificationError(error));
      }
    };

    void verify();
  }, [token]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await authService.verifyEmail({
        email: values.email.trim(),
        code: values.code.trim(),
      });

      setSuccessMessage("Email verified successfully. Redirecting to login...");
      scheduleRedirectToLogin();
    } catch (error) {
      setErrorMessage(normalizeVerificationError(error));
    }
  };

  const resendVerificationEmail = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const email = form.getValues("email").trim();

    if (!email) {
      form.setError("email", { type: "manual", message: "Email is required." });
      return;
    }

    const isValid = await form.trigger("email");
    if (!isValid) return;

    setIsResending(true);
    try {
      await authService.resendVerification({ email });
      setSuccessMessage("Verification email resent. Please check your inbox.");
    } catch (error) {
      setErrorMessage(normalizeVerificationError(error));
    } finally {
      setIsResending(false);
    }
  };

  return {
    form,
    onSubmit,
    resendVerificationEmail,
    successMessage,
    errorMessage,
    autoVerifyStatus,
    autoVerifyMessage,
    isResending,
  };
};
