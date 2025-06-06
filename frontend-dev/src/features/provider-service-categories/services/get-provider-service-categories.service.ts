import { API_ROUTE } from "@/config";
import type { ProviderServiceCategoryResponse } from "../types/provider-service-category.type";

export const getProviderServiceCategories =
  async (page:number): Promise<ProviderServiceCategoryResponse> => {
    const response = await fetch(`${API_ROUTE}/provider-service-categories?page=${page}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des fournisseurs par catégorie de service"
      );
    }

    return response.json();
  };
