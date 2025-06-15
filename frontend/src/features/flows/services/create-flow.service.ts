import { API_ROUTE } from "@/constants/api-route.constant";
import type { FlowFormData } from "../schemas/flow.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateFlow() {
  const csrfFetch = useCsrfFetch();

  return (data: FlowFormData) =>
    csrfFetch(`${API_ROUTE}/flows`, {
      method: "POST",
      body: data,
    });
}
