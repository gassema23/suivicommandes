import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import { SessionExpiryModal } from "@/features/common/auth/components/SessionExpiryModal";
import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import type { User } from "@/features/users/types/user.type";
import logoutUser from "@/lib/logout-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import Cookies from "js-cookie"; 

export interface AuthContext {
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
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
  canPerformAction: (resource: string, action: string) => boolean;
  getUserPermissions: () => Array<{ resource: string; actions: string[] }>;
  refetchUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(30);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await fetch(`${API_ROUTE}/auth/me`, {
        credentials: "include",
      });
      if (res.status === 401) return null;
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    },
  });

  const logout = React.useCallback(async () => {
    await logoutUser();
    await queryClient.invalidateQueries();
    queryClient.clear();
    window.location.href = "/login";
  }, [queryClient]);

  // Cette fonction ne fait que refetch l'utilisateur (à utiliser après login)
  const refetchUser = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Cette fonction ne fait que rediriger (le vrai login est fait dans le composant de login)
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
        (p) => p.resource === resource
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = Cookies.get("accessTokenExpiresAt");
      if (expiresAt) {
        const msLeft = parseInt(expiresAt, 10) - Date.now();
        const seconds = Math.floor(msLeft / 1000);
        if (seconds <= 30 && seconds > 0) {
          setModalOpen(true);
          setSecondsLeft(seconds);
        } else if (seconds <= 0) {
          setModalOpen(false);
          logout();
        } else {
          setModalOpen(false);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [logout]);

  // Rafraîchir le token
  const handleContinue = async () => {
    setModalOpen(false);
    // Appelle ton endpoint de refresh
    await fetch(`${API_ROUTE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    refetchUser();
  };

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
      <SessionExpiryModal
        open={modalOpen}
        timer={secondsLeft}
        onLogout={logout}
        onContinue={handleContinue}
      />
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
