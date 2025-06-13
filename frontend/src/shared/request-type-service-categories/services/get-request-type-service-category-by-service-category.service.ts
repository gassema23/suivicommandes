import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";

export async function getRequestTypeServiceCategoryByServiceCategory(id?: string): Promise<RequestTypeServiceCategory[]> {
  const res = await fetch(`${API_ROUTE}/service-categories/${id}/request-type-service-categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des catégorie de services");
  }

  return res.json();
};