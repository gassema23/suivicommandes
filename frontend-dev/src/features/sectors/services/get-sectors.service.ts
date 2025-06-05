import { API_ROUTE } from "@/config";
import type { SectorsResponse } from "../types/sector.type";

export const getSectors = async (page:number): Promise<SectorsResponse> => {
  console.log("Fetching sectors for page:", page);
  const response = await fetch(`${API_ROUTE}/sectors?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des secteurs");
  }

  return response.json();
};
