import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

export async function setActivate2FA({
  secret,
  code,
}: {
  secret: string;
  code: string;
}) {
  const res = await apiFetch(`${API_ROUTE}/auth/2fa/enable`, {
    method: "POST",
    body: JSON.stringify({ secret, code }),
  });
  
  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de l'activation du 2FA"
    );
  }
  return result;
}
