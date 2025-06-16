import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserInformationFormData } from "../schemas/user-information.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateUserInformation(id: string, data: UserInformationFormData) {
  const res = await apiFetch(`${API_ROUTE}/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour des informations utilisateur"
    );
  }
  return result as UserInformationFormData;
}
