import { API_ROUTE } from "@/config";
import type { ProviderFormData } from "../schemas/provider.schema";

export async function updateProvider(
  providerId: string,
  data: ProviderFormData
) {
  const res = await fetch(`${API_ROUTE}/providers/${providerId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
