import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { Sector } from "../types/sector.type";

export const fetchSector = async (id: string): Promise<Sector> => {
  const res = await fetch(`${API_ROUTE}/sectors/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du secteur"
    );
  }

  return result;
};
