import { API_ROUTE } from "@/constants/api-route.constant";
import type { SectorsResponse } from "@/shared/sectors/types/sector.type";

export const getSectors = async (page:number): Promise<SectorsResponse> => {
  const response = await fetch(`${API_ROUTE}/sectors?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des secteurs");
  }

  return response.json();
};
