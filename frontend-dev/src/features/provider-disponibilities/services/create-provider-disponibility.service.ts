import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ProviderDisponibilityFormData } from "../schemas/provider-disponibility.schema";

export const createProviderDisponibility = async (
  data: ProviderDisponibilityFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/provider-disponibilities`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création de la disponibilité fournisseur"
    );
  }
  return response.json();
};
