import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateDelayType(id: string, data: DelayTypeFormData) {
  const res = await apiFetch(`${API_ROUTE}/delay-types/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du type de délai"
    );
  }
  return result as DelayTypeFormData;
}
