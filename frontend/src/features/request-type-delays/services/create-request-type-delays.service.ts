import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelayFormData } from "../schemas/request-type-delay.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createRequestTypeDelay(data: RequestTypeDelayFormData) {
  const res = await apiFetch(`${API_ROUTE}/request-type-delays`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du délai de type de demande");
  }
  return result as RequestTypeDelayFormData;
}
