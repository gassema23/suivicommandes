import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibilityResponse } from "../types/provider-disponibility.type";

export const getProviderDisponibilities = async (
  page: number
): Promise<ProviderDisponibilityResponse> => {
  const response = await fetch(`${API_ROUTE}/provider-disponibilities?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des disponibilités fournisseur");
  }

  return response.json();
};
