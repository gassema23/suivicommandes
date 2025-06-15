import { API_ROUTE } from "@/constants/api-route.constant";
import type { Service } from "@/shared/services/types/service.type";

// Fetch resources depuis le backend
export async function fetchServicesBySector(id?: string): Promise<Service[]> {
  const res = await fetch(`${API_ROUTE}/sectors/${id}/services`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des services");
  }

  return res.json();
};