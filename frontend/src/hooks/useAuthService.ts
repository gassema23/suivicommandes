import { API_ROUTE } from "@/constants/api-route.constant";
import { PUBLIC_ROUTES } from "@/constants/public-route.constant";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useApiFetch";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  user: AuthUser | null | undefined;
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
  refreshToken: () => Promise<void>;
}

export interface AuthUser {
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

const AUTH_USER_QUERY_KEY = ["auth", "user"] as const;

async function apiFetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let res = await fetch(input, { ...init, credentials: "include" });
  if (res.status === 401) {
    // Tente un refresh
    const refreshRes = await fetch(`${API_ROUTE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (refreshRes.ok) {
      // Rejoue la requête initiale
      res = await fetch(input, { ...init, credentials: "include" });
    } else {
      // Refresh échoué, déconnecte l'utilisateur
      throw new Error("Session expirée");
    }
  }
  return res;
}

async function fetchUser(): Promise<AuthUser | null> {
  const res = await apiFetchWithRefresh(`${API_ROUTE}/auth/me`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

async function logoutRequest() {
  await refreshTokenRequest(); // Assure que le token est rafraîchi avant de se déconnecter
  const res = await fetch(`${API_ROUTE}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Logout failed");
}

async function refreshTokenRequest() {
  const res = await fetch(`${API_ROUTE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Refresh token failed");
}

type LoginCredentials = {
  email: string;
  password: string;
};

export interface LoginFormData {
  credentials: LoginCredentials;
  redirect?: string;
}

export const login = async ({ credentials }: LoginFormData) => {
  const res = await apiFetch(`${API_ROUTE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Échec de la connexion");
  }
};

export function useAuthService() {
  const queryClient = useQueryClient();
  const isPublicRoute = PUBLIC_ROUTES.includes(window.location.pathname);

  const userQuery = useQuery<AuthUser | null>({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !isPublicRoute,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      window.location.href = "/login";
    },
  });

  const refreshMutation = useMutation({
    mutationFn: refreshTokenRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    },
  });

  // Helpers centralisés
  const hasRole = (role: string) =>
    userQuery.data?.role?.roleName === role || false;

  const hasPermission = (resource: string, action: string) => {
    const permissions = userQuery.data?.role?.permissions;
    if (!permissions) return false;
    const permission = permissions.find((p) => p.resource === resource);
    if (!permission) return false;
    return permission.actions.includes(action);
  };

  const canPerformAction = (resource: string, action: string) =>
    hasPermission(resource, action);

  const hasAllPermissions = (
    permissions: Array<{ resource: string; action: string }>
  ) =>
    permissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );

  const hasAnyPermission = (
    permissions: Array<{ resource: string; action: string }>
  ) =>
    permissions.some(({ resource, action }) => hasPermission(resource, action));

  const getUserPermissions = () => userQuery.data?.role?.permissions || [];

  return {
    user: userQuery.data,
    isLoadingUser: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    login,
    refetchUser: async () => {
      await userQuery.refetch();
    },
    logout: logoutMutation.mutateAsync,
    refreshToken: refreshMutation.mutateAsync,
    hasRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canPerformAction,
    getUserPermissions,
  };
}
