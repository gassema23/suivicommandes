import { API_ROUTE } from "@/constants/api-route.constant";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

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

async function fetchUser(): Promise<AuthUser | null> {
  let res = await fetch(`${API_ROUTE}/auth/me`, {
    credentials: "include",
  });
  if (res.status === 401) {
    console.log("Token expiré, tentative de rafraîchissement");
    try {
      await refreshTokenRequest();
    } catch (error) {
      console.error("Échec du rafraîchissement du token", error);
      return null;
    }
    // Retry user fetch après refresh
    res = await fetch(`${API_ROUTE}/auth/me`, {
      credentials: "include",
    });
  }
  console.log("User fetch response status:", res.status);
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

async function logoutRequest() {
  const csrfToken = Cookies.get("csrfToken");
  if (!csrfToken) {
    throw new Error("CSRF token is missing");
  }
  const res = await fetch(`${API_ROUTE}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
  });
  if (!res.ok) throw new Error("Logout failed");
  return true;
}

async function refreshTokenRequest() {
  const csrfToken = Cookies.get("csrfToken");
  if (!csrfToken) {
    throw new Error("CSRF token is missing");
  }
  const res = await fetch(`${API_ROUTE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
  });
  if (!res.ok) throw new Error("Refresh token failed");
  return true;
}

export function useAuthService() {
  const queryClient = useQueryClient();

  const userQuery = useQuery<AuthUser | null>({
    queryKey: ["auth", "user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await logoutRequest();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        window.location.href = "/login";
      }
    },
  });

  const refreshMutation = useMutation({
    mutationFn: refreshTokenRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  return {
    user: userQuery.data,
    isLoadingUser: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    refetchUser: userQuery.refetch,
    logout: logoutMutation.mutateAsync,
    refreshToken: refreshMutation.mutateAsync,
  };
}
