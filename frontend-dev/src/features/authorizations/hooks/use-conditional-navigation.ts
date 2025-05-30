import { useAuth } from "@/providers/auth-provider";
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
      console.warn(`Navigation bloquée vers ${to}: permission manquante`);
      return false;
    }

    // Vérification du rôle
    if (requiredRole && !hasRole(requiredRole)) {
      console.warn(`Navigation bloquée vers ${to}: rôle insuffisant`);
      return false;
    }

    navigate({ to });
    return true;
  }, [hasPermission, hasRole, navigate]);

  return { navigateIfAllowed };
};