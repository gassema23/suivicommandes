import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategory } from "../types/provider-service-category.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchProviderServiceCategory= async (id: string): Promise<ProviderServiceCategory> => {
  const res = await apiFetch(`${API_ROUTE}/provider-service-categories/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du fournisseur"
    );
  }

  return result;
};
