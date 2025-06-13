import { API_ROUTE } from "@/constants/api-route.constant";
import type { Deliverable } from "../types/deliverable.type";

export const fetchDeliverable = async (id: string): Promise<Deliverable> => {
  const res = await fetch(`${API_ROUTE}/deliverables/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du livrable"
    );
  }

  return result;
};
