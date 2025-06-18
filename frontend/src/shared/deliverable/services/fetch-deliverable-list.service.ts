import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Deliverable } from "../types/deliverable.type";

export const fetchDeliverablesList = async (): Promise<Deliverable[]> => {
  const res = await apiFetch(`${API_ROUTE}/deliverables/deliverableLists`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la liste des livrables"
    );
  }

  return result;
};
