import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeDelayFormData } from "../schemas/request-type-delay.schema";

export async function updateRequestTypeDelay(
  requestTypeDelayId: string,
  data: RequestTypeDelayFormData
) {
  const { sectorId, serviceId, serviceCategoryId, ...payload } = data;
  const res = await fetch(
    `${API_ROUTE}/request-type-delays/${requestTypeDelayId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du type de délai"
    );
  }

  return result;
}
