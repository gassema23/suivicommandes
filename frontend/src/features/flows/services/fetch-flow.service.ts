import { API_ROUTE } from "@/constants/api-route.constant";
import type { Flow } from "../../../shared/flow/types/flow.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchFlow = async (id: string): Promise<Flow> => {
  const res = await apiFetch(`${API_ROUTE}/flows/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du flux de transmission"
    );
  }

  return result;
};
