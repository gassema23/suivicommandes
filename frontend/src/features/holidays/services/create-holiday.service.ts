import { API_ROUTE } from "@/constants/api-route.constant";
import type { HolidayFormData } from "../schemas/holiday.schema";

export const createHoliday = async (
  holiday: HolidayFormData
): Promise<void> => {
    if (!holiday.holidayName || !holiday.holidayDate) {
        throw new Error("Le nom et la date du jour férié sont requis");
    }

  const response = await fetch(`${API_ROUTE}/holidays`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holiday),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du jour férié"
    );
  }
  return response.json();
};
