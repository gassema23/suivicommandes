import { API_ROUTE } from "@/constants/api-route.constant";

import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayRequestTypeFormData } from "../schemas/deliverable-delay-request-type.schema";

export async function createDeliverableDelayRequestType(
  data: DeliverableDelayRequestTypeFormData
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sectorId, serviceId, serviceCategoryId, ...payload } = data;

  const res = await apiFetch(`${API_ROUTE}/deliverable-delay-request-types`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la création du type de demande de délai de livraison"
    );
  }
  return result as DeliverableDelayRequestTypeFormData;
}
