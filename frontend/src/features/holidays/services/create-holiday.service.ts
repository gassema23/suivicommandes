import { API_ROUTE } from "@/constants/api-route.constant";
import type { HolidayFormData } from "../schemas/holiday.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useCreateHoliday() {
  const csrfFetch = useCsrfFetch();

  return (data: HolidayFormData) =>
    csrfFetch(`${API_ROUTE}/holidays`, {
      method: "POST",
      body: data,
    });
}
