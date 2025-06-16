import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionTypeFormData } from "../schemas/requisition-type.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export const createRequisitionType = async (
  data: RequisitionTypeFormData
): Promise<void> => {
  const response = await apiFetch(`${API_ROUTE}/requisition-types`, {
    method: "POST",
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
