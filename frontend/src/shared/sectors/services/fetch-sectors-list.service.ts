import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Sector } from "@/shared/sectors/types/sector.type";

// Fetch resources depuis le backend
export const fetchSectorsList = async (): Promise<Sector[]> => {
  const res = await apiFetch(`${API_ROUTE}/sectors/sectorsList`, {
    method: "GET",
    credentials: "include",
  });


  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la liste des secteurs"
    );
  }

  return result;
};