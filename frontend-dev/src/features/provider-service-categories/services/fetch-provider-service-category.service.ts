import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ProviderServiceCategory } from "../types/provider-service-category.type";

export const fetchProviderServiceCategory= async (id: string): Promise<ProviderServiceCategory> => {
  const res = await fetch(`${API_ROUTE}/provider-service-categories/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du fournisseur"
    );
  }

  return result;
};
