import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ConformityTypeFormData } from "../schemas/conformity-type.schema";

export async function updateConformityType(
  conformityTypeId: string,
  data: ConformityTypeFormData
) {
  const res = await fetch(`${API_ROUTE}/conformity-types/${conformityTypeId}`, {
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
      result.message || "Erreur lors de la mise à jour du type de conformité"
    );
  }

  return result;
}
