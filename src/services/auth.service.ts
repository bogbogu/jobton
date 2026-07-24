import { mainFetch } from "../api/mainFetch";
import { mainPost } from "../api/mainPost";
import type { AuthSuccessResult, AuthUser, LoginPayload, RegisterPayload } from "../types/auth-type";

type ApiPayload = Record<string, unknown>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pickString = (obj: Record<string, unknown>, key: string) => {
  const value = obj[key];
  return typeof value === "string" ? value : null;
};

const extractToken = (payload: unknown) => {
  if (!isObject(payload)) return null;

  return (
    pickString(payload, "token") ??
    pickString(payload, "accessToken") ??
    pickString(payload, "jwt") ??
    (isObject(payload.data) ? pickString(payload.data, "token") : null)
  );
};

const extractUser = (payload: unknown): AuthUser | null => {
  if (!isObject(payload)) return null;

  const directUser = payload.user;
  if (isObject(directUser) && typeof directUser.email === "string") {
    return directUser as AuthUser;
  }

  const nestedData = payload.data;
  if (isObject(nestedData)) {
    const nestedUser = nestedData.user;
    if (isObject(nestedUser) && typeof nestedUser.email === "string") {
      return nestedUser as AuthUser;
    }
  }

  if (typeof payload.email === "string") {
    return payload as AuthUser;
  }

  return null;
};

const normalizeAuthResult = (payload: unknown): AuthSuccessResult => {
  const token = extractToken(payload);

  if (!token) {
    throw new Error("Authentication token was not returned by the server.");
  }

  return {
    token,
    user: extractUser(payload),
  };
};

export const authService = {
  register: async (payload: RegisterPayload) => {
    const data = await mainPost<ApiPayload, RegisterPayload>(
      "/api/auth/register",
      payload,
      undefined,
      "Registration failed. Please try again."
    );

    return normalizeAuthResult(data);
  },

  login: async (payload: LoginPayload) => {
    const data = await mainPost<ApiPayload, LoginPayload>(
      "/api/auth/login",
      payload,
      undefined,
      "Login failed. Please check your credentials."
    );

    return normalizeAuthResult(data);
  },

  getCurrentUser: async () => {
    const data = await mainFetch<unknown>(
      "/api/auth/me",
      undefined,
      "Unable to restore your session."
    );
    const user = extractUser(data);

    if (!user) {
      throw new Error("Unable to read current user from the response.");
    }

    return user;
  },
};
