import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";

export const createDelayType = async (
  data: DelayTypeFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/delay-types`, {
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
      errorData.message || "Erreur lors de la création du type de délai"
    );
  }
  return response.json();
};
