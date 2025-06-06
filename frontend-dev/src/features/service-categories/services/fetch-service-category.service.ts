import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ServiceCategory } from "../types/service-category.type";

export const fetchServiceCategory = async (
  id: string
): Promise<ServiceCategory> => {
  const res = await fetch(`${API_ROUTE}/service-categories/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la catégorie de service"
    );
  }

  return result;
};
