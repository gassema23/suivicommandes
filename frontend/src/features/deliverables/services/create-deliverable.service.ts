import { API_ROUTE } from "@/constants/api-route.constant";
import type { DeliverableFormData } from "../schemas/deliverable.schema";

export const createDeliverable = async (
  data: DeliverableFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/deliverables`, {
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
      errorData.message || "Erreur lors de la création du livrable"
    );
  }
  return response.json();
};
