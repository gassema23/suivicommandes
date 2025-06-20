import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionTypeFormData } from "../schemas/requisition-type.schema";

export async function updateRequisitionType(
  requisitionTypeId: string,
  data: RequisitionTypeFormData
) {
  const res = await fetch(`${API_ROUTE}/requisition-types/${requisitionTypeId}`, {
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
      result.message || "Erreur lors de la mise à jour du type de réquisition"
    );
  }

  return result;
}
