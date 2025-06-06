import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { FlowFormData } from "../schemas/flow.schema";

export const createFlow = async (data: FlowFormData): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/flows`, {
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
      errorData.message || "Erreur lors de la création du flux de transmission"
    );
  }
  return response.json();
};
