import { API_ROUTE } from "@/constants/api-route.constant";
import type { HolidayFormData } from "../schemas/holiday.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateHoliday() {
  const csrfFetch = useCsrfFetch();

  return (id: string, data: HolidayFormData) =>
    csrfFetch(`${API_ROUTE}/holidays/${id}`, {
      method: "PATCH",
      body: data,
    });
}
