import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ServiceCategory } from "@/shared/service-categories/types/service-category.type";

export const fetchServiceCategory = async (
  id: string
): Promise<ServiceCategory> => {
  const res = await apiFetch(`${API_ROUTE}/service-categories/${id}`, {
    method: "GET",
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
