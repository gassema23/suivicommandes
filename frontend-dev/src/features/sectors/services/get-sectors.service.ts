import { API_ROUTE } from "@/config";
import type { Sector } from "../types/sector.type";

export const getSectors = async (): Promise<Sector> => {
  const response = await fetch(`${API_ROUTE}/sectors`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des secteurs");
  }

  return response.json();
};
