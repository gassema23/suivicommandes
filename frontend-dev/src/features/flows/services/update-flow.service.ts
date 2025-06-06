import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { FlowFormData } from "../schemas/flow.schema";

export async function updateFlow(flowId: string, data: FlowFormData) {
  const res = await fetch(`${API_ROUTE}/flows/${flowId}`, {
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
      result.message || "Erreur lors de la mise à jour du flux de transmission"
    );
  }

  return result;
}
