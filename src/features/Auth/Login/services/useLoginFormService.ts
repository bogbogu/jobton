import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginFormService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, isAuthLoading, authError, clearAuthError } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const onSubmit = async (values: LoginFormValues) => {
    clearAuthError();
    await login({
      email: values.email,
      password: values.password,
    });

    navigate(nextPath ?? "/", { replace: true });
  };

  return {
    form,
    onSubmit,
    nextPath,
    isAuthenticated,
    isAuthLoading,
    authError,
  };
};
