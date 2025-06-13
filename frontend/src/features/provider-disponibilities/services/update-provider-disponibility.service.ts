import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibilityFormData } from "../schemas/provider-disponibility.schema";

export async function updateProviderDisponibility(
  providerDisponibilityId: string,
  data: ProviderDisponibilityFormData
) {
  const res = await fetch(
    `${API_ROUTE}/provider-disponibilities/${providerDisponibilityId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la mise à jour de la disponibilité fournisseur"
    );
  }

  return result;
}
