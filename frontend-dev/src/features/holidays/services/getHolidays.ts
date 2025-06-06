import { API_ROUTE } from "@/config";
import type { Holiday } from "../types/holiday.type";

export const getHolidays = async (): Promise<Holiday> => {
  const response = await fetch(`${API_ROUTE}/holidays`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des jours fériés");
  }

  return response.json();
};
