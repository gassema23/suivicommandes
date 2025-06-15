import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateDelayType() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: DelayTypeFormData) =>
    csrfFetch(`${API_ROUTE}/delay-types/${id}`, {
      method: "PATCH",
      body: data,
    });
}
