import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { SubdivisionClientFormData } from "../schemas/subdivision-client.schema";

export async function createSubdivisionClient(data: SubdivisionClientFormData) {
  const res = await fetch(`${API_ROUTE}/subdivision-clients/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la création de la subdivision client"
    );
  }
  return result as SubdivisionClientFormData;
}
