import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Sector } from "@/shared/sectors/types/sector.type";

export const fetchSector = async (id: string): Promise<Sector> => {
  const res = await apiFetch(`${API_ROUTE}/sectors/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du secteur"
    );
  }

  return result;
};
