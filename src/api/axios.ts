import axios from "axios";
import { localAuthTokenStorage } from "../services/auth.storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

export const clearUnauthorizedHandler = () => {
  unauthorizedHandler = null;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localAuthTokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localAuthTokenStorage.clearToken();
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);
