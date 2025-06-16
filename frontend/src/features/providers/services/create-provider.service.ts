import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderFormData } from "../schemas/provider.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export const createProvider = async (
  provider: ProviderFormData
): Promise<void> => {
  const response = await apiFetch(`${API_ROUTE}/providers`, {
    method: "POST",
    body: JSON.stringify(provider),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du fournisseur"
    );
  }
  return response.json();
};
