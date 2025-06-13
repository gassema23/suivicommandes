import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";

export async function updateDelayType(
  delayTypeId: string,
  data: DelayTypeFormData
) {
  const res = await fetch(`${API_ROUTE}/delay-types/${delayTypeId}`, {
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
      result.message || "Erreur lors de la mise à jour du type de délai"
    );
  }

  return result;
}
