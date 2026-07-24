export interface AuthUser {
  id?: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthSuccessResult {
  token: string;
  user: AuthUser | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}
