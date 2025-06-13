import { API_ROUTE } from "@/constants/api-route.constant";
import type { CreateRoleFormData } from "../schemas/role.schema";

export async function updateRole(roleId: string, data: CreateRoleFormData) {
  const res = await fetch(`${API_ROUTE}/roles/${roleId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la mise à jour du rôle");
  }
  return result;
}
