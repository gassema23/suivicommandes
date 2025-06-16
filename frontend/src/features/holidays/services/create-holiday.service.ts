import { API_ROUTE } from "@/constants/api-route.constant";
import type { HolidayFormData } from "../schemas/holiday.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createHoliday(data: HolidayFormData) {
  const res = await apiFetch(`${API_ROUTE}/holidays`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la création du jour férié"
    );
  }
  return result as HolidayFormData;
}
