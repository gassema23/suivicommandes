import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { DeliverableResponse } from "../types/deliverable.type";

export const getDeliverables = async (
  page: number
): Promise<DeliverableResponse> => {
  const response = await fetch(`${API_ROUTE}/deliverables?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des livrables");
  }

  return response.json();
};
