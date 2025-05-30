import { API_ROUTE } from "@/config";
import type { Team } from "../types/team.type";

export const fetchTeam = async (id: string): Promise<Team> => {
    
  const response = await fetch(`${API_ROUTE}/teams/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'équipe");
  }

  return response.json();
};
