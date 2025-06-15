import { API_ROUTE } from "@/constants/api-route.constant";

// Fetch resources depuis le backend
export const fetchResources = async (): Promise<string[]> => {
  const res = await fetch(`${API_ROUTE}/roles/resources/`, {
    method: "GET",
    credentials: "include",
  });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Erreur lors du chargement des rôles");
    }
    return result as string[];
};