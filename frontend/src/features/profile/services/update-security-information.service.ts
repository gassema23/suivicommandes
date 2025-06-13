import { API_ROUTE } from "@/constants/api-route.constant";
import type { PasswordFormData } from "../schemas/password.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateSecurityInformation() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: PasswordFormData) =>
    csrfFetch(`${API_ROUTE}/auth/update-password/${id}`, {
      method: "PATCH",
      body: data,
    });
}
