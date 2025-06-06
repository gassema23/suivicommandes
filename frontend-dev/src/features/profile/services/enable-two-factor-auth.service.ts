import { API_ROUTE } from "@/features/common/constants/api-route.constant";

export async function enableTwoFactorAuth() {
  const res = await fetch(`${API_ROUTE}/auth/2fa/generate`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de l'activation du 2FA"
    );
  }
  return result;
}
