import { API_ROUTE } from "@/config";
import type { Sector } from "@/features/sectors/types/sector.type";

// Fetch resources depuis le backend
export const fetchSectorsList = async (): Promise<Sector[]> => {
  const res = await fetch(`${API_ROUTE}/sectors/sectorsList`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des secteurs");
  return res.json();
};