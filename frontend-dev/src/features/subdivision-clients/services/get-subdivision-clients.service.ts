import { API_ROUTE } from "@/config";
import type { SubdivisionClient } from "../types/subdivision-client.type";

export const getSubdivisionClients = async (): Promise<SubdivisionClient> => {
  const response = await fetch(`${API_ROUTE}/subdivision-clients`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des subdivisions clients");
  }

  return response.json();
};
