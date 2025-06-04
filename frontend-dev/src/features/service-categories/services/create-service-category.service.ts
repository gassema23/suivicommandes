import { API_ROUTE } from "@/config";
import type { ServiceCategoryFormData } from "../schemas/service-category.schema";

export async function createServiceCategory(data: ServiceCategoryFormData) {
   const { sectorId, ...payload } = data;

  const res = await fetch(`${API_ROUTE}/service-categories/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la création de la catégorie de service"
    );
  }
  return result as ServiceCategoryFormData;
}
