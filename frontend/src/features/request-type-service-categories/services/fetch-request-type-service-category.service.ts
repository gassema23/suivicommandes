import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";

export const fetchRequestTypeServiceCategory= async (id: string): Promise<RequestTypeServiceCategory> => {
  const res = await apiFetch(`${API_ROUTE}/request-type-service-categories/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de demande de catégorie de service"
    );
  }

  return result;
};
