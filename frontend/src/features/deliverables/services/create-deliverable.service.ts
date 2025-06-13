import { API_ROUTE } from "@/constants/api-route.constant";
import type { DeliverableFormData } from "../schemas/deliverable.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateDeliverable() {
  const csrfFetch = useCsrfFetch();

  return (data: DeliverableFormData) =>
    csrfFetch(`${API_ROUTE}/deliverables`, {
      method: "POST",
      body: data,
    });
}
