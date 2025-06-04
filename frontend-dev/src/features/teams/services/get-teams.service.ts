import { API_ROUTE } from "@/config";
import type { TeamResponse } from "../types/team.type";

export const getTeams = async (): Promise<TeamResponse> => {
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
