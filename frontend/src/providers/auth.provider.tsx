import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import { API_ROUTE } from "@/constants/api-route.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import Cookies from "js-cookie";
import { useAuthService } from "@/shared/auth/libs/useAuthService";

interface AuthUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  emailVerifiedAt?: string | null;
  email?: string;
  initials?: string;
  createdAt: string;
  role: Role;
  team: Team;
}

interface Team {
  id: string;
  teamName: string;
  teamDescription?: string;
  owner: AuthUser;
}

interface Role {
  id: string;
  roleName: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  resource: string;
  actions: string[];
}

export interface AuthContext {
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
  logout: () => Promise<void>;
  user: AuthUser | null;
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasAllPermissions: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  hasAnyPermission: (
    permissions: Array<{ resource: string; action: string }>
  ) => boolean;
  canPerformAction: (resource: string, action: string) => boolean;
  getUserPermissions: () => Array<{ resource: string; actions: string[] }>;
  refetchUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { refreshToken, logout: authLogout } = useAuthService();

  // Récupération user avec gestion refresh si 401
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await fetch(`${API_ROUTE}/auth/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        try {
          await refreshToken();
        } catch {
          return null;
        }

        const retryRes = await fetch(`${API_ROUTE}/auth/me`, {
          credentials: "include",
        });
        if (!retryRes.ok) return null;
        const retryData = await retryRes.json();
        return retryData.user;
      }

      if (!res.ok) return null;

      const data = await res.json();
      return data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const logout = React.useCallback(async () => {
    await authLogout();
    Cookies.remove("accessTokenExpiresAt");
    await queryClient.invalidateQueries();
    queryClient.clear();
  }, [authLogout, queryClient]);

  const refetchUser = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  const login = React.useCallback((redirectTo?: string) => {
    window.location.href = redirectTo || "/";
  }, []);

  const hasRole = React.useCallback(
    (role: string) => user?.role?.roleName === role || false,
    [user]
  );

  const hasPermission = React.useCallback(
    (resource: string, action: string) => {
      if (!user?.role?.permissions) return false;
      const permission = user.role.permissions.find(
        (p: Permission) => p.resource === resource
      );
      if (!permission) return false;
      return permission.actions.includes(action);
    },
    [user]
  );

  const canPerformAction = React.useCallback(
    (resource: string, action: string) => hasPermission(resource, action),
    [hasPermission]
  );

  const hasAllPermissions = React.useCallback(
    (permissions: Array<{ resource: string; action: string }>) =>
      permissions.every(({ resource, action }) =>
        hasPermission(resource, action)
      ),
    [hasPermission]
  );

  const hasAnyPermission = React.useCallback(
    (permissions: Array<{ resource: string; action: string }>) =>
      permissions.some(({ resource, action }) =>
        hasPermission(resource, action)
      ),
    [hasPermission]
  );

  const getUserPermissions = React.useCallback(
    () => user?.role?.permissions || [],
    [user]
  );

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
        refetchUser,
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
