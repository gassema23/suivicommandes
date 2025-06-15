import { API_ROUTE } from "@/constants/api-route.constant";
import type { ConformityTypeResponse } from "@/shared/conformity-types/types/conformity-type.type";

export const getConformityTypes = async (
  page: number
): Promise<ConformityTypeResponse> => {
  const response = await fetch(`${API_ROUTE}/conformity-types?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de conformité");
  }

  return response.json();
};
