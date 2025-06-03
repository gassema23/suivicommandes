import { API_ROUTE } from "@/config";
import type { Service } from "@/features/services/types/service.type";

// Fetch resources depuis le backend
export const fetchServicesBySector = async (sectorId: string): Promise<Service[]> => {
  const res = await fetch(`${API_ROUTE}/sectors/${sectorId}/services`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des services");
  }

  return res.json();
};