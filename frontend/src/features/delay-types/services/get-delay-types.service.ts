import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DelayTypeResponse } from "@/shared/delay-types/types/delay-type.type";

export const getDelayTypes = async (
  page: number
): Promise<DelayTypeResponse> => {
  const response = await apiFetch(`${API_ROUTE}/delay-types?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de délai");
  }

  return response.json();
};
