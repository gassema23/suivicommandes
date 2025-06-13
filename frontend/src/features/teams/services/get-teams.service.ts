import { API_ROUTE } from "@/constants/api-route.constant";
import type { TeamResponse } from "@/shared/teams/types/team.type";

export const getTeams = async (page: number): Promise<TeamResponse> => {
  const res = await fetch(`${API_ROUTE}/teams?page=${page}`, {
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
