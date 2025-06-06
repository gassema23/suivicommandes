import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { UserFormData } from "../schemas/user.schema";

export async function updateUser(userId: string, data: UserFormData) {
  const res = await fetch(`${API_ROUTE}/users/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
