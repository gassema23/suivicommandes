import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

// Fetch resources depuis le backend
export const fetchResources = async (): Promise<string[]> => {
  const res = await apiFetch(`${API_ROUTE}/roles/resources/`, {
    method: "GET",
  });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Erreur lors du chargement des rôles");
    }
    return result as string[];
};