import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategoryFormData } from "../schemas/provider-service-category.schema";

export async function updateProviderServiceCategory(
  providerServiceCategoryId: string,
  data: ProviderServiceCategoryFormData
) {
  const payload = {
    providerId: data.providerId,
    serviceCategoryId: data.serviceCategoryId,
  };
  const res = await fetch(
    `${API_ROUTE}/provider-service-categories/${providerServiceCategoryId}`,
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
      result.message || "Erreur lors de la mise à jour du fournisseur"
    );
  }

  return result;
}
