import { API_ROUTE } from "@/config";
import type { User } from "@/features/users/types/user.type";
import logoutUser from "@/lib/logout-user";
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
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fonction utilitaire pour récupérer l'utilisateur
  const fetchUser = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROUTE}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data?.user ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial de l'utilisateur
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = React.useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const login = React.useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

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

  if (loading) {
    return null; // ou <LoadingPage /> si tu veux un loader
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
