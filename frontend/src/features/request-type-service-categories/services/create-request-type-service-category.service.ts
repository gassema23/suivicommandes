import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";

import { apiFetch } from "@/hooks/useApiFetch";

export async function createRequestTypeServiceCategory(
  data: RequestTypeServiceCategoryFormData
) {
  const res = await apiFetch(`${API_ROUTE}/request-type-service-categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la création de la catégorie de service pour le type de demande"
    );
  }
  return result as RequestTypeServiceCategoryFormData;
}
