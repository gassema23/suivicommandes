import { API_ROUTE } from "@/constants/api-route.constant";

export async function setActivate2FA({
  secret,
  code,
}: {
  secret: string;
  code: string;
}) {
  const res = await fetch(`${API_ROUTE}/auth/2fa/enable`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
