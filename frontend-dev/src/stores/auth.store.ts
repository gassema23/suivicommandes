import { create } from "zustand";
import type { User } from "@/features/users/types/user.type";

interface Permission {
  resource: string;
  actions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasAllPermissions: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  hasAnyPermission: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  canPerformAction: (resource: string, action: string) => boolean;
  getUserPermissions: () => Permission[];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  hasRole: (role) => get().user?.role?.roleName === role || false,

  hasPermission: (resource, action) => {
    const permissions = get().user?.role?.permissions;
    if (!permissions) return false;
    const permission = permissions.find((p) => p.resource === resource);
    if (!permission) return false;
    return permission.actions.includes(action);
  },

  hasAllPermissions: (permissions) =>
    permissions.every(({ resource, action }) =>
      get().hasPermission(resource, action)
    ),

  hasAnyPermission: (permissions) =>
    permissions.some(({ resource, action }) =>
      get().hasPermission(resource, action)
    ),

  canPerformAction: (resource, action) => get().hasPermission(resource, action),

  getUserPermissions: () => get().user?.role?.permissions || [],
}));
