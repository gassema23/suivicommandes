import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { SectorFormData } from "../schemas/sector.schema";

export async function updateSector(sectorId: string, data: SectorFormData) {
  const res = await fetch(`${API_ROUTE}/sectors/${sectorId}`, {
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
      result.message || "Erreur lors de la mise à jour du secteur"
    );
  }

  return result;
}
