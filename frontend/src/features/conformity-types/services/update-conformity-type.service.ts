import { API_ROUTE } from "@/constants/api-route.constant";
import type { ConformityTypeFormData } from "../schemas/conformity-type.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateConformityType() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: ConformityTypeFormData) =>
    csrfFetch(`${API_ROUTE}/conformity-types/${id}`, {
      method: "PATCH",
      body: data,
    });
}
