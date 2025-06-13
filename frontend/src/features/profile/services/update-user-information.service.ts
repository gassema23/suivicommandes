import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserInformationFormData } from "../schemas/user-information.schema";

export async function updateUserInformation(userId: string, data: UserInformationFormData) {
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
  return result as UserInformationFormData;
}
