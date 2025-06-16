import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ConformityTypeResponse } from "@/shared/conformity-types/types/conformity-type.type";

export const getConformityTypes = async (
  page: number
): Promise<ConformityTypeResponse> => {
  const response = await apiFetch(`${API_ROUTE}/conformity-types?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de conformité");
  }

  return response.json();
};
