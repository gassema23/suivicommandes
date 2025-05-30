import { API_ROUTE } from "@/config";
import type { TeamUpdateFormData } from "../schemas/team.schema";

export async function updateTeam(teamId: string, data: TeamUpdateFormData) {
  const res = await fetch(`${API_ROUTE}/teams/${teamId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de l'équipe");
  }
  return res.json();
}