import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";

export async function updateRequestTypeServiceCategory(
  requestTypeServiceCategoryId: string,
  data: RequestTypeServiceCategoryFormData
) {
  const { sectorId, serviceId, ...payload } = data;
  const res = await fetch(
    `${API_ROUTE}/request-type-service-categories/${requestTypeServiceCategoryId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la mise à jour de la catégorie de service par type de demande"
    );
  }

  return result;
}
