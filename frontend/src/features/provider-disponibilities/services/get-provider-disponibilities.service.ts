import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibilityResponse } from "../types/provider-disponibility.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getProviderDisponibilities = async (
  page: number
): Promise<ProviderDisponibilityResponse> => {
  const res = await apiFetch(
    `${API_ROUTE}/provider-disponibilities?page=${page}`,
    {
      method: "GET",
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération des disponibilités fournisseur"
    );
  }

  return result;
};
