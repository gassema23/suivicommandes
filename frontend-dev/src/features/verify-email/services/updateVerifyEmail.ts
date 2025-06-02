import { API_ROUTE } from "@/config";
import type { VerifyEmailFormData } from "../shemas/verify-email.schema";

export async function updateVerifyEmail(
  userId: string,
  data: VerifyEmailFormData
) {
  const res = await fetch(`${API_ROUTE}/auth/onboard/${userId}`, {
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
      result.message || "Erreur lors de la vérification du courriel"
    );
  }
  return result;
}
