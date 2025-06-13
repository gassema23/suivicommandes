import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeFormData } from "../schemas/request-type.schema";

export const createRequestType = async (
  data: RequestTypeFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/request-types`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
