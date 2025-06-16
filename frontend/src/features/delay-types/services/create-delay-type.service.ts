import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema"
import { apiFetch } from "@/hooks/useApiFetch";

export async function createDelayType(data: DelayTypeFormData) {
  const res = await apiFetch(`${API_ROUTE}/delay-types`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du type de délai");
  }
  return result as DelayTypeFormData;
}
