import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategoryFormData } from "../schemas/provider-service-category.schema";

export async function createProviderServiceCategory(
  data: ProviderServiceCategoryFormData
) {
  const payload = {
    providerId: data.providerId,
    serviceCategoryId: data.serviceCategoryId,
  }

  const res = await fetch(`${API_ROUTE}/provider-service-categories`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
