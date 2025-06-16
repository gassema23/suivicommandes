import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { RequestTypeResponse } from "@/shared/request-types/types/request-type.type";

export const getRequestTypes = async (
  page: number
): Promise<RequestTypeResponse> => {
  const response = await apiFetch(`${API_ROUTE}/request-types?page=${page}`, {
    method: "GET",
  });

  
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors du chargement des types de demande");

  return result;
};
