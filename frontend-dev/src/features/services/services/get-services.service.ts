import { API_ROUTE } from "@/config";
import type { ServiceResponse } from "@/features/services/types/service.type";

export const getServices = async (): Promise<ServiceResponse> => {
  const response = await fetch(`${API_ROUTE}/services`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des services");
  }

  return response.json();
};
