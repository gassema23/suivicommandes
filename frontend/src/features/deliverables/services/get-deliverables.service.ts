import { API_ROUTE } from "@/constants/api-route.constant";
import type { DeliverableResponse } from "../../../shared/deliverable/types/deliverable.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getDeliverables = async (
  page: number
): Promise<DeliverableResponse> => {
  const response = await apiFetch(`${API_ROUTE}/deliverables?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des livrables");
  }

  return response.json();
};
