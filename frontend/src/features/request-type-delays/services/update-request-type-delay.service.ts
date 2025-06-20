import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelayFormData } from "../schemas/request-type-delay.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateRequestTypeDelay(
  id: string,
  data: RequestTypeDelayFormData
) {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sectorId, serviceId, serviceCategoryId, ...payload } = data;
  const res = await apiFetch(`${API_ROUTE}/request-type-delays/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la mise à jour du délai de type de demande"
    );
  }
  return result as RequestTypeDelayFormData;
}
