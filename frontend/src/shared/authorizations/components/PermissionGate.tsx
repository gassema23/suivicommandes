import { useAuth } from "@/providers/auth.provider";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useNavigationHistory } from "../hooks/useNavigationHistory";
interface PermissionCheck {
  resource: string;
  action: string;
}
interface PermissionGateProps {
  // Permission simple
  resource?: string;
  action?: string;
  // Permissions multiples
  permissions?: PermissionCheck[];
  // Rôle
  role?: string;
  requireAll?: boolean;
  // Options de redirection
  redirectOnFail?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  permissions = [],
  role,
  requireAll = false,
  redirectOnFail = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } =
    useAuth();
  const navigate = useNavigate();
  const { goToPreviousOrDashboard } = useNavigationHistory();

  const checkPermissions = useCallback(() => {
    // Vérification d'une permission simple
    if (resource && action && !hasPermission(resource, action)) {
      return false;
    }

    // Vérification d'un rôle
    if (role && !hasRole(role)) {
      return false;
    }

    // Vérification de plusieurs permissions
    if (permissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);

      if (!hasRequiredPermissions) {
        return false;
      }
    }

    return true;
  }, [
    resource,
    action,
    permissions,
    role,
    requireAll,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
  ]);

  useEffect(() => {
    if (redirectOnFail && !checkPermissions()) {
      const redirectPath = goToPreviousOrDashboard();
      navigate({ to: redirectPath });
    }
  }, [redirectOnFail, checkPermissions, navigate, goToPreviousOrDashboard]);

  if (!checkPermissions()) {
    if (redirectOnFail) {
      return null; // Le redirect se fait dans useEffect
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
