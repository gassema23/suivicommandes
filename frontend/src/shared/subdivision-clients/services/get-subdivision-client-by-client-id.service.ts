import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClient } from "../../../shared/subdivision-clients/types/subdivision-client.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getSubdivisionClientByClientId = async (
  id?: string
): Promise<SubdivisionClient[]> => {
  const response = await apiFetch(
    `${API_ROUTE}/subdivision-clients/subdivision-client-client-id/${id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des subdivisions clients pour le client"
    );
  }

  return response.json();
};
