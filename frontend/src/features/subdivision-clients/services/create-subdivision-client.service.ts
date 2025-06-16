import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClientFormData } from "../schemas/subdivision-client.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createSubdivisionClient(data: SubdivisionClientFormData) {
  const res = await apiFetch(`${API_ROUTE}/subdivision-clients/`, {
    method: "POST",
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
