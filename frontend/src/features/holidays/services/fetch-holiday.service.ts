import { API_ROUTE } from "@/constants/api-route.constant";
import type { Holiday } from "../types/holiday.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchHoliday= async (id: string): Promise<Holiday> => {
  const res = await apiFetch(`${API_ROUTE}/holidays/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du jour férié"
    );
  }

  return result;
};
