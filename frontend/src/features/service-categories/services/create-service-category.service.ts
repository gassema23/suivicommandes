import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceCategoryFormData } from "../schemas/service-category.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createServiceCategory(data: ServiceCategoryFormData) {
  const res = await apiFetch(`${API_ROUTE}/service-categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la création de la catégorie de service"
    );
  }
  return result as ServiceCategoryFormData;
}
