import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import { API_ROUTE } from "@/config";
import { QUERY_KEYS } from "@/config/query-key";
import type { User } from "@/features/users/types/user.type";
import logoutUser from "@/lib/logout-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasAllPermissions: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  hasAnyPermission: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  canPerformAction: (resource: string, action: string) => boolean; // Alias plus lisible
  getUserPermissions: () => Array<{ resource: string; actions: string[] }>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Utilise React Query pour charger l'utilisateur
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    // Utilise le cache de React Query pour éviter les appels réseau inutiles
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await fetch(`${API_ROUTE}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.user ?? null;
    },
  });

  const logout = React.useCallback(async () => {
    await logoutUser();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
    queryClient.clear();
    window.location.href = "/login";
  }, [queryClient]);

  const login = React.useCallback(
    async (redirectTo?: string) => {
      await refetch();
      window.location.href = redirectTo || "/";
    },
    [refetch]
  );
  // Vérification du rôle
  const hasRole = React.useCallback(
    (role: string) => {
      return user?.role?.roleName === role || false;
    },
    [user]
  );

  // Vérification d'une permission spécifique (ressource + action)
  const hasPermission = React.useCallback(
    (resource: string, action: string) => {
      if (!user?.role?.permissions) return false;

      // Chercher la permission qui correspond à la resource
      const permission = user.role.permissions.find(
        (p) => p.resource === resource
      );
      if (!permission) return false;

      // Vérifier si l'action est dans le tableau actions
      return permission.actions.includes(action);
    },
    [user]
  );

  // Alias plus lisible pour hasPermission
  const canPerformAction = React.useCallback(
    (resource: string, action: string) => {
      return hasPermission(resource, action);
    },
    [hasPermission]
  );

  // Vérification que l'utilisateur a TOUTES les permissions requises
  const hasAllPermissions = React.useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      return permissions.every(({ resource, action }) =>
        hasPermission(resource, action)
      );
    },
    [hasPermission]
  );

  // Vérification que l'utilisateur a AU MOINS UNE des permissions requises
  const hasAnyPermission = React.useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      return permissions.some(({ resource, action }) =>
        hasPermission(resource, action)
      );
    },
    [hasPermission]
  );

  // Récupérer toutes les permissions de l'utilisateur
  const getUserPermissions = React.useCallback(() => {
    return user?.role?.permissions || [];
  }, [user]);

  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <LoadingProgress duration={2000} color="var(--foreground)" height={6} />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasRole,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        canPerformAction,
        getUserPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
