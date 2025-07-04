import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeResponse } from "@/shared/delay-types/types/delay-type.type";

export const getDelayTypes = async (
  page: number
): Promise<DelayTypeResponse> => {
  const response = await fetch(`${API_ROUTE}/delay-types?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de délai");
  }

  return response.json();
};
