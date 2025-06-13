import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateRequestTypeServiceCategory() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: RequestTypeServiceCategoryFormData) => {
    const payload = {
    serviceCategoryId: data.serviceCategoryId,
    requestTypeId: data.requestTypeId,
    availabilityDelay: data.availabilityDelay,
    minimumRequiredDelay: data.minimumRequiredDelay,
    serviceActivationDelay: data.serviceActivationDelay,
    };

    console.log("Updating service category with payload:", payload);

    return csrfFetch(`${API_ROUTE}/request-type-service-categories/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };
}
