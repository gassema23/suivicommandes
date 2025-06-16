import { API_ROUTE } from "@/constants/api-route.constant";
import type { DeliverableFormData } from "../schemas/deliverable.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createDeliverable(data: DeliverableFormData) {
  const res = await apiFetch(`${API_ROUTE}/deliverables`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du livrable");
  }
  return result as DeliverableFormData;
}
