import { PERMISSIONS } from "../types/auth.types";
import { isValidPermission } from "../helpers/isValidPermission";
import type { PermissionCheck } from "@/types/permissions.type";

export const useAvailablePermissions = () => {
  const getAllPermissions = (): PermissionCheck[] => {
    const allPermissions: PermissionCheck[] = [];
    
    Object.values(PERMISSIONS).forEach(resourcePermissions => {
      Object.values(resourcePermissions).forEach(permission => {
        allPermissions.push(permission);
      });
    });
    
    return allPermissions;
  };

  const getPermissionsByResource = (resource: string): PermissionCheck[] => {
    const resourceKey = resource.toUpperCase() as keyof typeof PERMISSIONS;
    if (!PERMISSIONS[resourceKey]) return [];
    
    return Object.values(PERMISSIONS[resourceKey]);
  };

  const getAllResources = (): string[] => {
    return Object.keys(PERMISSIONS).map(key => key.toLowerCase());
  };

  return {
    getAllPermissions,
    getPermissionsByResource,
    getAllResources,
    isValidPermission
  };
};