import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authEmailService } from "../../../../services/authEmail.service";
import { authEmailFlowStorage } from "../../../../services/authEmailFlowStorage";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const useForgotPasswordFormService = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const resetToken = crypto.randomUUID();
    authEmailFlowStorage.saveResetToken(values.email, resetToken);

    const resetUrl = `${window.location.origin}/reset-password?token=${encodeURIComponent(resetToken)}`;

    try {
      await authEmailService.send({
        type: "forgot-password",
        to: values.email,
        resetUrl,
      });

      setSuccessMessage("If an account exists for this email, a reset link will be sent.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email right now.";
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
