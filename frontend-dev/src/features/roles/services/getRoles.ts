import { API_ROUTE } from "@/config";
import type { Role } from "../types/role.type";

export const getRoles = async (): Promise<{ data: Role[] }> => {
  const res = await fetch(`${API_ROUTE}/roles`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération des rôles");
  }
  return result as { data: Role[]};
};

export const getRolesList = async (): Promise<Role[]> => {
  const res = await fetch(`${API_ROUTE}/roles/rolesList`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération des rôles");
  }
  return result as Role[];
};
