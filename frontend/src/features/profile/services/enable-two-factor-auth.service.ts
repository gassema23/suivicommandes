import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

export async function enableTwoFactorAuth() {
  const res = await apiFetch(`${API_ROUTE}/auth/2fa/generate`, {
    method: "GET",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de l'activation du 2FA"
    );
  }
  return result;
}
