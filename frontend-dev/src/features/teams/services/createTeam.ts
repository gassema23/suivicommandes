import { API_ROUTE } from "@/config";
import type { TeamFormData } from "../schemas/team.schema";

export async function createTeam(data: TeamFormData) {
  const res = await fetch(`${API_ROUTE}/teams/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la création de l'équipe");
  }
  return res.json();
}