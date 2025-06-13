import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClientFormData } from "../schemas/subdivision-client.schema";

export async function updateSubdivisionClient(
  subdivisionClientId: string,
  data: SubdivisionClientFormData
) {
  const res = await fetch(
    `${API_ROUTE}/subdivision-clients/${subdivisionClientId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour de la subdivision client"
    );
  }

  return result;
}
