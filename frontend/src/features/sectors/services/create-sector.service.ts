import { API_ROUTE } from "@/constants/api-route.constant";
import type { SectorFormData } from "../schemas/sector.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateSector() {
  const csrfFetch = useCsrfFetch();

  return (data: SectorFormData) =>
    csrfFetch(`${API_ROUTE}/sectors/`, {
      method: "POST",
      body: data,
    });
}
