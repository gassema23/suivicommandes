import { useAuth } from "@/providers/auth-provider";

export const usePermissions = () => {
  const { hasPermission, hasRole, hasAllPermissions, hasAnyPermission, canPerformAction, getUserPermissions } = useAuth();

  return {
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
    getUserPermissions,
    // Alias plus lisibles
    can: canPerformAction,
    is: hasRole,
    canAll: hasAllPermissions,
    canAny: hasAnyPermission,
    // Fonctions helper pour des cas courants
    canRead: (resource: string) => hasPermission(resource, 'read'),
    canCreate: (resource: string) => hasPermission(resource, 'create'),
    canUpdate: (resource: string) => hasPermission(resource, 'update'),
    canDelete: (resource: string) => hasPermission(resource, 'delete'),
    canExport: (resource: string) => hasPermission(resource, 'export'),
    canImport: (resource: string) => hasPermission(resource, 'import'),
  };
};