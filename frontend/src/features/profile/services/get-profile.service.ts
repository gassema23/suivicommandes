import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

export async function getProfile() {
  const res = await apiFetch(`${API_ROUTE}/auth/me`, {
    method: "GET",
  });
  
  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du profil"
    );
  }
  return result;
}
