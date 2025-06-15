import { API_ROUTE } from "@/constants/api-route.constant";
import type { ClientFormData } from "../schemas/clients.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateClient() {
  const csrfFetch = useCsrfFetch();

  return (data: ClientFormData) =>
    csrfFetch(`${API_ROUTE}/clients`, {
      method: "POST",
      body: data,
    });
}
