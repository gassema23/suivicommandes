import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibilityFormData } from "../schemas/provider-disponibility.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateProviderDisponibility(
  id: string,
  data: ProviderDisponibilityFormData
) {
  const res = await apiFetch(`${API_ROUTE}/provider-disponibilities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la mise à jour de la disponibilité fournisseur"
    );
  }
  return result as ProviderDisponibilityFormData;
}
