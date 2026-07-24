import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { authEmailService } from "../../../../services/authEmail.service";
import { authEmailFlowStorage } from "../../../../services/authEmailFlowStorage";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    acceptTerms: z.boolean().refine((value) => value, "You must accept the terms and conditions."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterFormService = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register: registerUser, isAuthLoading, authError, clearAuthError } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearAuthError();
    await registerUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    authEmailFlowStorage.saveVerificationCode(values.email, verificationCode);

    const verifyUrl = `${window.location.origin}/verify-email?email=${encodeURIComponent(values.email)}`;

    await Promise.allSettled([
      authEmailService.send({
        type: "verify-email",
        to: values.email,
        firstName: values.firstName,
        verificationCode,
        verifyUrl,
      }),
      authEmailService.send({
        type: "welcome",
        to: values.email,
        firstName: values.firstName,
      }),
    ]);

    navigate("/verify-email", { replace: true, state: { email: values.email } });
  };

  return {
    form,
    onSubmit,
    isAuthenticated,
    isAuthLoading,
    authError,
  };
};
