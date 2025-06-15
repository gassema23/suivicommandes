import { PERMISSIONS } from "../types/auth.types";

export const isValidPermission = (resource: string, action: string): boolean => {
  const resourceKey = resource.toUpperCase() as keyof typeof PERMISSIONS;
  if (!PERMISSIONS[resourceKey]) return false;
  
  const actionKey = action.toUpperCase() as keyof typeof PERMISSIONS[typeof resourceKey];
  return !!PERMISSIONS[resourceKey][actionKey];
};