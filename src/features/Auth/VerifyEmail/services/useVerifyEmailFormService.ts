import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be at least 6 characters.")
    .max(12, "Verification code is too long."),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const useVerifyEmailFormService = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async () => {
    setSuccessMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSuccessMessage("Email verified successfully. You can continue to login.");
  };

  return {
    form,
    onSubmit,
    successMessage,
  };
};
