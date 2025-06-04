import {redirect} from "@tanstack/react-router";

interface PermissionCheck {
  resource: string;
  action: string;
}

// =============================================================================
// 1. Route Guards pour TanStack Router
// =============================================================================

// Fonction helper pour vérifier les permissions dans beforeLoad
export const createPermissionGuard = (
  requiredPermissions: PermissionCheck[] = [],
  requiredRole?: string,
  requireAll: boolean = false
) => {
  return async ({ context }: any) => {
    const { user, hasPermission, hasRole, hasAllPermissions, hasAnyPermission } = context.auth;

    // Vérification de l'authentification
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: window.location.pathname + window.location.search
        }
      });
    }

    // Vérification du rôle
    if (requiredRole && !hasRole(requiredRole)) {
      throw redirect({
        to: '/unauthorized'
      });
    }

    // Vérification des permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
      
      if (!hasRequiredPermissions) {
        throw redirect({
          to: '/unauthorized'
        });
      }
    }

    return { user };
  };
};

// Guard spécialisé pour admin
export const adminGuard = createPermissionGuard([], 'admin');

// Guard spécialisé pour utilisateurs connectés
export const authGuard = createPermissionGuard([]);