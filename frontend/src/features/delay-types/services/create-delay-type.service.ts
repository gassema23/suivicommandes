import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayTypeFormData } from "../schemas/delay-type.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateDelayType() {
  const csrfFetch = useCsrfFetch();

  return (data: DelayTypeFormData) =>
    csrfFetch(`${API_ROUTE}/delay-types`, {
      method: "POST",
      body: data,
    });
}
