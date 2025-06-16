import { API_ROUTE } from "@/constants/api-route.constant";
import type { HolidayResponse } from "../types/holiday.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getHolidays = async (page: number): Promise<HolidayResponse> => {
  const response = await apiFetch(`${API_ROUTE}/holidays?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des jours fériés");
  }

  return response.json();
};
