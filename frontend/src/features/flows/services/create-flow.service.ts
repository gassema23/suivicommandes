import { API_ROUTE } from "@/constants/api-route.constant";
import type { FlowFormData } from "../schemas/flow.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createFlow(data: FlowFormData) {
  const res = await apiFetch(`${API_ROUTE}/flows`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du flux");
  }
  return result as FlowFormData;
}
