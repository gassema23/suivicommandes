import { API_ROUTE } from "@/config";
import type { Team } from "../types/team.type";

export const getTeams = async (): Promise<Team> => {
  const res = await fetch(`${API_ROUTE}/teams`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération des équipes"
    );
  }

  return result;
};
