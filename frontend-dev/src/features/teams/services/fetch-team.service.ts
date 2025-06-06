import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { Team } from "../types/team.type";

export const fetchTeam = async (id: string): Promise<Team> => {
  const res = await fetch(`${API_ROUTE}/teams/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'équipe"
    );
  }

  return result;
};
