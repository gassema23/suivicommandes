import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

// Fetch resources depuis le backend
export const fetchEmailToken = async (token: string): Promise<string> => {
  const res = await apiFetch(`${API_ROUTE}/auth/verify-email?token=${token}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la vérification du courriel"
    );
  }
  return result as string;
};
