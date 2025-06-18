import { API_ROUTE } from "@/constants/api-route.constant";
import type { Deliverable } from "../../../shared/deliverable/types/deliverable.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchDeliverable = async (id: string): Promise<Deliverable> => {
  const res = await apiFetch(`${API_ROUTE}/deliverables/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du livrable"
    );
  }

  return result;
};
