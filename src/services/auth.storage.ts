const AUTH_TOKEN_KEY = "jobton.auth.token";

export interface AuthTokenStorage {
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const localAuthTokenStorage: AuthTokenStorage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};
