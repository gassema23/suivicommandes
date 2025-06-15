import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderResponse } from "@/shared/providers/types/provider.type";

export const getProviders = async (page:number): Promise<ProviderResponse> => {
  const response = await fetch(`${API_ROUTE}/providers?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des fournisseurs");
  }

  return response.json();
};
