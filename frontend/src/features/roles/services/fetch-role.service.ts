import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Role } from "@/shared/roles/types/role.type";

export const fetchRole = async (id: string): Promise<Role> => {
  const res = await apiFetch(`${API_ROUTE}/roles/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors du récupération du rôle");
  }
  return result as Role;
};
