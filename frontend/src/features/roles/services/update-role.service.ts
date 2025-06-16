import { API_ROUTE } from "@/constants/api-route.constant";
import type { CreateRoleFormData } from "../schemas/role.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateRole(roleId: string, data: CreateRoleFormData) {
  const res = await apiFetch(`${API_ROUTE}/roles/${roleId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la mise à jour du rôle");
  }
  return result;
}
