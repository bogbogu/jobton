import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { authEmailFlowStorage } from "../../../../services/authEmailFlowStorage";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be at least 6 characters.")
    .max(12, "Verification code is too long."),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const useVerifyEmailFormService = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const queryEmail = new URLSearchParams(location.search).get("email");
    const stateEmail = (location.state as { email?: string } | null)?.email;
    const email = (stateEmail ?? queryEmail ?? "").trim();

    if (!email) {
      setErrorMessage("Missing email context. Please register again to receive a verification code.");
      return;
    }

    const isValid = authEmailFlowStorage.verifyCode(email, values.code);

    if (!isValid) {
      setErrorMessage("Verification code is invalid or expired. Please request a new code.");
      return;
    }

    setSuccessMessage("Email verified successfully. You can continue to login.");
  };

  return {
    form,
    onSubmit,
    successMessage,
    errorMessage,
  };
};
