import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceCategoryFormData } from "../schemas/service-category.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateServiceCategory() {
  const csrfFetch = useCsrfFetch();

  return (data: ServiceCategoryFormData) => {
    const payload = {
      serviceId: data.serviceId,
      serviceCategoryName: data.serviceCategoryName,
      serviceCategoryDescription: data.serviceCategoryDescription,
      isMultiLink: data.isMultiLink,
      isMultiProvider: data.isMultiProvider,
      isRequiredExpertise: data.isRequiredExpertise,
    };

    return csrfFetch(`${API_ROUTE}/service-categories/`, {
      method: "POST",
      body: payload,
    });
  };
}