import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeResponse } from "../types/request-type.type";

export const getRequestTypes = async (
  page: number
): Promise<RequestTypeResponse> => {
  const response = await fetch(`${API_ROUTE}/request-types?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de demande");
  }

  return response.json();
};
