import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import * as React from "react";
import { useAuthService } from "@/hooks/useAuthService";

const AuthContext = React.createContext<ReturnType<
  typeof useAuthService
> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    isLoadingUser,
    isAuthenticated,
    login,
    refetchUser,
    logout,
    refreshToken,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
    hasRole,
  } = useAuthService();

  if (isLoadingUser) {
    return (
      <LoadingProgress duration={2000} color="var(--foreground)" height={6} />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        isAuthenticated,
        login,
        refetchUser,
        logout,
        refreshToken,
        getUserPermissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canPerformAction,
        hasRole,
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
