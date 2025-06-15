import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClient } from "../types/subdivision-client.type";

export const fetchSubdivisionClient = async (
  id: string
): Promise<SubdivisionClient> => {
  const res = await fetch(`${API_ROUTE}/subdivision-clients/${id}`, {
    method: "GET",
    credentials: "include",
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
