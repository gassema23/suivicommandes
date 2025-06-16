import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibilityFormData } from "../schemas/provider-disponibility.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createProviderDisponibility(
  data: ProviderDisponibilityFormData
) {
  const res = await apiFetch(`${API_ROUTE}/provider-disponibilities`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du jour férié"
    );
  }
  return result as ProviderDisponibilityFormData;
}
