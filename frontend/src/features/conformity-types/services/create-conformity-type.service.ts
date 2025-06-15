import { API_ROUTE } from "@/constants/api-route.constant";
import type { ConformityTypeFormData } from "../schemas/conformity-type.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateConformityType() {
  const csrfFetch = useCsrfFetch();

  return (data: ConformityTypeFormData) =>
    csrfFetch(`${API_ROUTE}/conformity-types`, {
      method: "POST",
      body: data,
    });
}
