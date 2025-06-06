import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { DeliverableFormData } from "../schemas/deliverable.schema";

export async function updateDeliverable(
  deliverableId: string,
  data: DeliverableFormData
) {
  const res = await fetch(`${API_ROUTE}/deliverables/${deliverableId}`, {
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
      result.message || "Erreur lors de la mise à jour du livrable"
    );
  }

  return result;
}
