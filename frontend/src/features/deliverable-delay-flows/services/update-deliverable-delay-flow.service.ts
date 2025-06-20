import { API_ROUTE } from "@/constants/api-route.constant";

import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayFlowFormData } from "../schemas/deliverable-delay-flow.schema";

export async function updateDeliverableDelayFlow(
  id: string,
  data: DeliverableDelayFlowFormData
) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sectorId, serviceId, serviceCategoryId,requestTypeServiceCategoryId, ...payload } = data;

  const res = await apiFetch(`${API_ROUTE}/deliverable-delay-flows/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la modification du délai de livraison des flux"
    );
  }
  return result as DeliverableDelayFlowFormData;
}
