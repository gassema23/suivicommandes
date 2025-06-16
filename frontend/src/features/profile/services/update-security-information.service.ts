import { API_ROUTE } from "@/constants/api-route.constant";
import type { PasswordFormData } from "../schemas/password.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateSecurityInformation(
  id: string,
  data: PasswordFormData
) {
  const res = await apiFetch(`${API_ROUTE}/auth/update-password/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour des informations de sécurité"
    );
  }
  return result as PasswordFormData;
}
