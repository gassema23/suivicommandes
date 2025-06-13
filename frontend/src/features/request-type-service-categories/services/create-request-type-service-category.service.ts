import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";

export const createRequestTypeServiceCategory = async (
  data: RequestTypeServiceCategoryFormData
): Promise<void> => {
  const payload = {
    serviceCategoryId: data.serviceCategoryId,
    requestTypeId: data.requestTypeId,
    availabilityDelay: data.availabilityDelay,
    minimumRequiredDelay: data.minimumRequiredDelay,
    serviceActivationDelay: data.serviceActivationDelay,
  };

  const response = await fetch(`${API_ROUTE}/request-type-service-categories`, {
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
