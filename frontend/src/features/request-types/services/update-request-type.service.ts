import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeFormData } from "../schemas/request-type.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateRequestType(
  requestTypeId: string,
  data: RequestTypeFormData
) {
  const res = await apiFetch(`${API_ROUTE}/request-types/${requestTypeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du type de demande"
    );
  }

  return result;
}
