import { API_ROUTE } from "@/constants/api-route.constant";
import type { Flow } from "../types/flow.type";

export const fetchFlow = async (id: string): Promise<Flow> => {
  const res = await fetch(`${API_ROUTE}/flows/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du flux de transmission"
    );
  }

  return result;
};
