import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateRequestTypeServiceCategory(
  id: string,
  data: RequestTypeServiceCategoryFormData
) {
  const res = await apiFetch(
    `${API_ROUTE}/request-type-service-categories/${id}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la mise à jour de la catégorie de service pour le type de demande"
    );
  }
  return result as RequestTypeServiceCategoryFormData;
}
