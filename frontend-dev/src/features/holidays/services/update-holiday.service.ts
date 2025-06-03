import { API_ROUTE } from "@/config";
import type { HolidayFormData } from "../schemas/holiday.schema";

export async function updateHoliday(holidayId: string, data: HolidayFormData) {
  const res = await fetch(`${API_ROUTE}/holidays/${holidayId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du jour férié"
    );
  }

  return result;
}
