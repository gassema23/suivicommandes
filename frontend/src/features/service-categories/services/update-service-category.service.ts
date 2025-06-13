import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceCategoryFormData } from "../schemas/service-category.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateServiceCategory() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: ServiceCategoryFormData) => {
    const payload = {
      serviceId: data.serviceId,
      serviceCategoryName: data.serviceCategoryName,
      serviceCategoryDescription: data.serviceCategoryDescription,
      isMultiLink: data.isMultiLink,
      isMultiProvider: data.isMultiProvider,
      isRequiredExpertise: data.isRequiredExpertise,
    };

    console.log("Updating service category with payload:", payload);

    return csrfFetch(`${API_ROUTE}/service-categories/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };
}
