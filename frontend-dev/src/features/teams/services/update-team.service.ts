import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { TeamFormData } from "../schemas/team.schema";

export async function updateTeam(teamId: string, data: TeamFormData) {
  const res = await fetch(`${API_ROUTE}/teams/${teamId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour de l'équipe"
    );
  }

  return result;
}