import { API_ROUTE } from "@/config";
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
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour du rôle");
  }
  return res.json();
}