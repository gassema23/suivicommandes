import { API_ROUTE } from "@/constants/api-route.constant";

export async function getProfile() {
  const res = await fetch(`${API_ROUTE}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  
  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du profil"
    );
  }
  return result;
}
