import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { RequestTypeServiceCategoryResponse } from "@/shared/request-type-service-categories/types/request-type-service-category.type";

export const getRequestTypeServiceCategories = async (
  page: number
): Promise<RequestTypeServiceCategoryResponse> => {
  const response = await apiFetch(
    `${API_ROUTE}/request-type-service-categories?page=${page}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des catégories de services par type de demande"
    );
  }

  return response.json();
};
