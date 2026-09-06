import type { UserRole } from "../types";

export function getDashboardPath(role?: UserRole | string): string {
  switch (role?.toLowerCase()) {
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}
