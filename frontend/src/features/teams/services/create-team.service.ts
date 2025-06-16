import { API_ROUTE } from "@/constants/api-route.constant";
import type { TeamFormData } from "../schemas/team.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function createTeam(data: TeamFormData) {
  const res = await apiFetch(`${API_ROUTE}/teams/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création de l'équipe");
  }
  return result as TeamFormData;
}
