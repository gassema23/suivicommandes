import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceFormData } from "../schemas/service.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateService() {
  const csrfFetch = useCsrfFetch();

  return (data: ServiceFormData) =>
    csrfFetch(`${API_ROUTE}/services/`, {
      method: "POST",
      body: data,
    });
}