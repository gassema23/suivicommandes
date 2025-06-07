import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeServiceCategory } from "../types/request-type-service-category.type";

export const fetchRequestTypeServiceCategory= async (id: string): Promise<RequestTypeServiceCategory> => {
  const res = await fetch(`${API_ROUTE}/request-type-service-categories/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de demande de catégorie de service"
    );
  }

  return result;
};
