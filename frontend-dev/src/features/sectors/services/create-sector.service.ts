import { API_ROUTE } from "@/config";
import type { SectorFormData } from "../schemas/sector.schema";

export const createSector = async (
  sector: SectorFormData
): Promise<void> => {
  const response = await fetch(`${API_ROUTE}/sectors`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sector),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du secteur"
    );
  }
  return response.json();
};
