import { API_ROUTE } from "@/constants/api-route.constant";
import type { DeliverableFormData } from "../schemas/deliverable.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateDeliverable() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: DeliverableFormData) =>
    csrfFetch(`${API_ROUTE}/deliverables/${id}`, {
      method: "PATCH",
      body: data,
    });
}
