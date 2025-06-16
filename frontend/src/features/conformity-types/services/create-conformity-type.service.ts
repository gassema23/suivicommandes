import { API_ROUTE } from "@/constants/api-route.constant";
import type { ConformityTypeFormData } from "../schemas/conformity-type.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createConformityType(data: ConformityTypeFormData) {
  const res = await apiFetch(`${API_ROUTE}/conformity-types`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du type de conformité");
  }
  return result as ConformityTypeFormData;
}
