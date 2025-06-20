import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderServiceCategoryFormData } from "../schemas/provider-service-category.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateProviderServiceCategory(
  providerServiceCategoryId: string,
  data: ProviderServiceCategoryFormData
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sectorId, serviceId, ...payload } = data;

  const res = await apiFetch(
    `${API_ROUTE}/provider-service-categories/${providerServiceCategoryId}`,
    {
      method: "PATCH",
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
