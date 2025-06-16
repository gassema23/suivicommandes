import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeFormData } from "../schemas/request-type.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export const createRequestType = async (
  data: RequestTypeFormData
): Promise<void> => {
  const response = await apiFetch(`${API_ROUTE}/request-types`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du type de demande"
    );
  }
  return response.json();
};
