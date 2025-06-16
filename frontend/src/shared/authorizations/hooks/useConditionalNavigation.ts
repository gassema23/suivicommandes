import { useAuth } from "@/providers/auth.provider";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export const useConditionalNavigation = () => {
  const { hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();

  const navigateIfAllowed = useCallback((
    to: string,
    requiredPermission?: { resource: string; action: string },
    requiredRole?: string
  ) => {
    // Vérification des permissions
    if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
      return false;
    }

    // Vérification du rôle
    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }

    navigate({ to });
    return true;
  }, [hasPermission, hasRole, navigate]);

  return { navigateIfAllowed };
};