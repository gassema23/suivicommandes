import { API_ROUTE } from "@/config";
import type { Team } from "../types/team.type";

export const getTeams = async (): Promise<Team> => {
  const response = await fetch(`${API_ROUTE}/teams`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des équipes");
  }

  return response.json();
};
