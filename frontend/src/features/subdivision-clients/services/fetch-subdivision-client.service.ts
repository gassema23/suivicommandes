import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClient } from "../../../shared/subdivision-clients/types/subdivision-client.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchSubdivisionClient = async (
  id: string
): Promise<SubdivisionClient> => {
  const res = await apiFetch(`${API_ROUTE}/subdivision-clients/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la subdivision client"
    );
  }

  return result;
};
