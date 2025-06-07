import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeResponse } from "../types/request-type.type";

export const getRequestTypes = async (
  page: number
): Promise<RequestTypeResponse> => {
  const response = await fetch(`${API_ROUTE}/request-types?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors du chargement des types de demande");

  return result;
};
