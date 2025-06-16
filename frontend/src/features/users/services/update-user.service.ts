import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserFormData } from "../schemas/user.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateUser(userId: string, data: UserFormData) {
  const res = await apiFetch(`${API_ROUTE}/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour de l'utilisateur"
    );
  }
  return result as UserFormData;
}
