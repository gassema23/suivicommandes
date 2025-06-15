import { API_ROUTE } from "@/constants/api-route.constant";
import type { ClientFormData } from "../schemas/clients.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateClient() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: ClientFormData) =>
    csrfFetch(`${API_ROUTE}/clients/${id}`, {
      method: "PATCH",
      body: data,
    });
}
