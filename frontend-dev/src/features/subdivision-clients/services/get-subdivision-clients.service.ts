import { API_ROUTE } from "@/config";
import type { SubdivisionClientResponse } from "../types/subdivision-client.type";

export const getSubdivisionClients =
  async (page:number): Promise<SubdivisionClientResponse> => {
    const response = await fetch(`${API_ROUTE}/subdivision-clients?page=${page}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des subdivisions clients"
      );
    }

    return response.json();
  };
