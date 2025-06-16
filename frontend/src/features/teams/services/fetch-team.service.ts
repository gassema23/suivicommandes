import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Team } from "@/shared/teams/types/team.type";

export const fetchTeam = async (id: string): Promise<Team> => {
  const res = await apiFetch(`${API_ROUTE}/teams/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'équipe"
    );
  }

  return result;
};
