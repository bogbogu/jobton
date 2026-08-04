import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { authService } from "../../../../services/auth.service";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const useResetPasswordFormService = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setErrorMessage("Reset token is missing. Please use the password reset link from your email.");
      return;
    }

    try {
      await authService.resetPassword({
        token,
        password: values.password,
      });

      setSuccessMessage("Password updated. You can now login with your new password.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password right now.";
      setErrorMessage(message);
    }
  };

  return {
    form,
    onSubmit,
    successMessage,
    errorMessage,
  };
};
