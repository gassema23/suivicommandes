import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceResponse } from "@/shared/services/types/service.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getServices = async (page:number): Promise<ServiceResponse> => {
  const response = await apiFetch(`${API_ROUTE}/services?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des services");
  }

  return response.json();
};
