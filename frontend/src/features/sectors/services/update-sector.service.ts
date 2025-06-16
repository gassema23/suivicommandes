import { API_ROUTE } from "@/constants/api-route.constant";
import type { SectorFormData } from "../schemas/sector.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateSector(id: string,data: SectorFormData) {
  const res = await apiFetch(`${API_ROUTE}/sectors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la mise à jour du secteur");
  }
  return result as SectorFormData;
}
