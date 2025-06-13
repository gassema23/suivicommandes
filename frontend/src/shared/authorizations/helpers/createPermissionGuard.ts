import { redirect } from "@tanstack/react-router";
import type { User } from "../types/user.type";

interface PermissionCheck {
  resource: string;
  action: string;
}

interface AuthContext {
  auth: {
    user: User;
    hasRole: (role: string) => boolean;
    hasAllPermissions: (permissions: PermissionCheck[]) => boolean;
    hasAnyPermission: (permissions: PermissionCheck[]) => boolean;
  };
}

interface GuardArgs {
  context: AuthContext;
}

// =============================================================================
// 1. Route Guards pour TanStack Router
// =============================================================================

export const createPermissionGuard = (
  requiredPermissions: PermissionCheck[] = [],
  requiredRole?: string,
  requireAll: boolean = false
) => {
  return async ({ context }: GuardArgs) => {
    const { user, hasRole, hasAllPermissions, hasAnyPermission } = context.auth;

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: window.location.pathname + window.location.search,
        },
      });
    }

    if (requiredRole && !hasRole(requiredRole)) {
      throw redirect({ to: "/unauthorized" });
    }

    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

      if (!hasRequiredPermissions) {
        throw redirect({ to: "/unauthorized" });
      }
    }

    return { user };
  };
};

// Guards spécialisés
export const adminGuard = createPermissionGuard([], "admin");
export const authGuard = createPermissionGuard([]);
