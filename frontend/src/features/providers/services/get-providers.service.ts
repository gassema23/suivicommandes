import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ProviderResponse } from "@/shared/providers/types/provider.type";

export const getProviders = async (page:number): Promise<ProviderResponse> => {
  const response = await apiFetch(`${API_ROUTE}/providers?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des fournisseurs");
  }

  return response.json();
};
