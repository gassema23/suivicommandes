import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderFormData } from "../schemas/provider.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateProvider(
  providerId: string,
  data: ProviderFormData
) {
  const res = await apiFetch(`${API_ROUTE}/providers/${providerId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du fournisseur"
    );
  }

  return result;
}
