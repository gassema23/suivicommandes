import { API_ROUTE } from "@/constants/api-route.constant";
import type { Holiday } from "../types/holiday.type";

export const fetchHoliday= async (id: string): Promise<Holiday> => {
  const res = await fetch(`${API_ROUTE}/holidays/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du jour férié"
    );
  }

  return result;
};
