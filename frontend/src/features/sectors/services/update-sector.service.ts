import { API_ROUTE } from "@/constants/api-route.constant";
import type { SectorFormData } from "../schemas/sector.schema";

import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateSector() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: SectorFormData) =>
    csrfFetch(`${API_ROUTE}/sectors/${id}`, {
      method: "PATCH",
      body: data,
    });
}
