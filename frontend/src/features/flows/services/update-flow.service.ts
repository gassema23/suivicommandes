import { API_ROUTE } from "@/constants/api-route.constant";
import type { FlowFormData } from "../schemas/flow.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateFlow() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: FlowFormData) =>
    csrfFetch(`${API_ROUTE}/flows/${id}`, {
      method: "PATCH",
      body: data,
    });
}
