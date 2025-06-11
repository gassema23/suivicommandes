import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeDelayFormData } from "../schemas/request-type-delay.schema";

export const createRequestTypeDelay = async (
  data: RequestTypeDelayFormData
): Promise<void> => {
  const { sectorId, serviceId, serviceCategoryId, ...payload } = data;

  const response = await fetch(`${API_ROUTE}/request-type-delays`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du fournisseur"
    );
  }
  return response.json();
};
