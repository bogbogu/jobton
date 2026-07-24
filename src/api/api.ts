import { apiClient } from "./axios";

// Keep both names to mirror the layered architecture convention.
export const authCreate = apiClient;
export const privateAccess = apiClient;
