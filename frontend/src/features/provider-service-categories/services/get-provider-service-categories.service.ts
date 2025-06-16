import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategoryResponse } from "../types/provider-service-category.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getProviderServiceCategories =
  async (page:number): Promise<ProviderServiceCategoryResponse> => {
    const response = await apiFetch(`${API_ROUTE}/provider-service-categories?page=${page}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des fournisseurs par catégorie de service"
      );
    }

    return response.json();
  };
