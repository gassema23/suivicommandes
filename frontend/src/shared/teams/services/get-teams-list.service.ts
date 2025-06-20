import { API_ROUTE } from "@/constants/api-route.constant";
import type { Team } from "@/shared/teams/types/team.type";

export const getTeamsList = async (): Promise<Team> => {
  const res = await fetch(`${API_ROUTE}/teams/teamsList`, {
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
