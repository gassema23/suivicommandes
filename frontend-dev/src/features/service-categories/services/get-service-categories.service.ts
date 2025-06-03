import { API_ROUTE } from "@/config";
import type { ServiceCategory } from "../types/service-category.type";

export const getServiceCategories = async (): Promise<ServiceCategory> => {
  const response = await fetch(`${API_ROUTE}/service-categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories de services");
  }

  return response.json();
};
