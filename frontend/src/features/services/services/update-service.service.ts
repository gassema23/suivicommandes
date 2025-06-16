import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceFormData } from "../schemas/service.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateService(id: string, data: ServiceFormData) {
  const res = await apiFetch(`${API_ROUTE}/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du service"
    );
  }
  return result as ServiceFormData;
}
