import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ProviderFormData } from "../schemas/provider.schema";

export const createProvider = async (
  provider: ProviderFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/providers`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
