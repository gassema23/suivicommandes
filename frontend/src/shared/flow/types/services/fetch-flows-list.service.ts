//fetchFlowsList
import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Flow } from "../flow.type";

// Fetch resources depuis le backend
export const fetchFlowsList = async (): Promise<Flow[]> => {
  const res = await apiFetch(`${API_ROUTE}/flows/flowLists`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la liste des flux de transmission"
    );
  }

  return result;
};
