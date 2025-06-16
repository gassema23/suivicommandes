import { API_ROUTE } from "@/constants/api-route.constant";
import type { VerifyEmailFormData } from "../shemas/verify-email.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateVerifyEmail(
  userId: string,
  data: VerifyEmailFormData
) {
  const res = await apiFetch(`${API_ROUTE}/auth/onboard/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la vérification du courriel"
    );
  }
  return result;
}
