import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelayFormData } from "../schemas/request-type-delay.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateRequestTypeDelay() {
  const csrfFetch = useCsrfFetch();

  return (data: RequestTypeDelayFormData) => {
    const payload = {
      requestTypeServiceCategoryId: data.requestTypeServiceCategoryId,
      delayTypeId: data.delayTypeId,
      delayValue: data.delayValue,
    };

    return csrfFetch(`${API_ROUTE}/request-type-delays`, {
      method: "POST",
      body: payload,
    });
  };
}
