import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeServiceCategoryFormData } from "../schemas/request-type-service-category.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateRequestTypeServiceCategory() {
  const csrfFetch = useCsrfFetch();

  return (data: RequestTypeServiceCategoryFormData) => {
    const payload = {
      serviceCategoryId: data.serviceCategoryId,
      requestTypeId: data.requestTypeId,
      availabilityDelay: data.availabilityDelay,
      minimumRequiredDelay: data.minimumRequiredDelay,
      serviceActivationDelay: data.serviceActivationDelay,
    };

    return csrfFetch(`${API_ROUTE}/request-type-service-categories`, {
      method: "POST",
      body: payload,
    });
  };
}
