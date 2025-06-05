import { API_ROUTE } from "@/config";
import type { ServiceCategory } from "../types/service-category.type";

export async function fetchServiceCategoriesByService(id?: string): Promise<ServiceCategory[]> {
  const res = await fetch(`${API_ROUTE}/services/${id}/service-categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des catégorie de services");
  }

  return res.json();
};