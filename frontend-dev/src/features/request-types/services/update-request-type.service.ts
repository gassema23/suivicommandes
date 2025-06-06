import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeFormData } from "../schemas/request-type.schema";

export async function updateRequestType(
  requestTypeId: string,
  data: RequestTypeFormData
) {
  const res = await fetch(`${API_ROUTE}/request-types/${requestTypeId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
