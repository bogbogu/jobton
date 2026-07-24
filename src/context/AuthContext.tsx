import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { clearUnauthorizedHandler, setUnauthorizedHandler } from "../api/axios";
import { authService } from "../services/auth.service";
import { localAuthTokenStorage } from "../services/auth.storage";
import type {
  AuthContextValue,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth-type";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localAuthTokenStorage.getToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const logout = useCallback(() => {
    localAuthTokenStorage.clearToken();
    setToken(null);
    setUser(null);
    setAuthError(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const applySession = useCallback((sessionToken: string, sessionUser: AuthUser | null) => {
    localAuthTokenStorage.setToken(sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localAuthTokenStorage.clearToken();
      setToken(null);
      setUser(null);
      setAuthError("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
    });

    return () => {
      clearUnauthorizedHandler();
    };
  }, [navigate]);

  useEffect(() => {
    const hydrateSession = async () => {
      const savedToken = localAuthTokenStorage.getToken();

      if (!savedToken) {
        setIsAuthLoading(false);
        return;
      }

      setIsAuthLoading(true);
      setAuthError(null);
      setToken(savedToken);

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localAuthTokenStorage.clearToken();
        setToken(null);
        setUser(null);
        if (error instanceof Error) {
          setAuthError(error.message);
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsAuthLoading(true);
      setAuthError(null);

      try {
        const result = await authService.login(payload);

        if (result.user) {
          applySession(result.token, result.user);
        } else {
          applySession(result.token, null);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to log in.";
        setAuthError(message);
        throw new Error(message);
      } finally {
        setIsAuthLoading(false);
      }
    },
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setIsAuthLoading(true);
      setAuthError(null);

      try {
        const result = await authService.register(payload);

        if (result.user) {
          applySession(result.token, result.user);
        } else {
          applySession(result.token, null);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to register.";
        setAuthError(message);
        throw new Error(message);
      } finally {
        setIsAuthLoading(false);
      }
    },
    [applySession]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAuthLoading,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [authError, clearAuthError, isAuthLoading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
