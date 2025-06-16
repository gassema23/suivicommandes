import { API_ROUTE } from "@/constants/api-route.constant";
import type { SubdivisionClientResponse } from "../types/subdivision-client.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getSubdivisionClients =
  async (page:number): Promise<SubdivisionClientResponse> => {
    const response = await apiFetch(`${API_ROUTE}/subdivision-clients?page=${page}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des subdivisions clients"
      );
    }

    return response.json();
  };
