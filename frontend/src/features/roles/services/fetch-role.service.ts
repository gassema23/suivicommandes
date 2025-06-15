import { API_ROUTE } from "@/constants/api-route.constant";
import type { Role } from "@/shared/roles/types/role.type";

export const fetchRole = async (id: string): Promise<Role> => {
  const res = await fetch(`${API_ROUTE}/roles/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération du rôle");
  }
  return result as Role;
};
