import type { AuthUser } from "../types/auth-type";

type RoleSource = Pick<AuthUser, "role"> | null | undefined;

/** Superadmins can do everything admins can, so admin screens accept both. */
export const isAdminRole = (user: RoleSource): boolean =>
  user?.role === "admin" || user?.role === "superadmin";

export const isSuperAdmin = (user: RoleSource): boolean => user?.role === "superadmin";
