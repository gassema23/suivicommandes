import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionTypeFormData } from "../schemas/requisition-type.schema";

export const createRequisitionType = async (
  data: RequisitionTypeFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/requisition-types`, {
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
      errorData.message || "Erreur lors de la création du type de réquisition"
    );
  }
  return response.json();
};
