import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { HolidayResponse } from "../types/holiday.type";

export const getHolidays = async (page: number): Promise<HolidayResponse> => {
  const response = await fetch(`${API_ROUTE}/holidays?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des jours fériés");
  }

  return response.json();
};
