import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategoryFormData } from "../schemas/provider-service-category.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createProviderServiceCategory(
  data: ProviderServiceCategoryFormData
) {
  const payload = {
    providerId: data.providerId,
    serviceCategoryId: data.serviceCategoryId,
  }

  const res = await apiFetch(`${API_ROUTE}/provider-service-categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de l'association du fournisseur & service"
    );
  }
  return result as ProviderServiceCategoryFormData;
}
