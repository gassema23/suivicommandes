import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceFormData } from "../schemas/service.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateService() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: ServiceFormData) =>
    csrfFetch(`${API_ROUTE}/services/${id}`, {
      method: "PATCH",
      body: data,
    });
}
