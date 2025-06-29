import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceCategoryResponse } from "@/shared/service-categories/types/service-category.type";

export const getServiceCategories = async (page:number): Promise<ServiceCategoryResponse> => {
  const response = await fetch(`${API_ROUTE}/service-categories?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories de services");
  }

  return response.json();
};
