import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";

export async function fetchServiceCategoriesByService(
  id?: string
): Promise<ServiceCategory[]> {
  const res = await apiFetch(`${API_ROUTE}/services/${id}/service-categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des catégorie de services");
  }

  return res.json();
}
