import { API_ROUTE } from "@/constants/api-route.constant";
import type { Role, RoleResponse } from "../types/role.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getRoles = async (): Promise<RoleResponse> => {
  const res = await apiFetch(`${API_ROUTE}/roles`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération des rôles");
  }
  return result as RoleResponse;
};

export const getRolesList = async (): Promise<Role[]> => {
  const res = await apiFetch(`${API_ROUTE}/roles/rolesList`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération des rôles");
  }
  return result as Role[];
};
