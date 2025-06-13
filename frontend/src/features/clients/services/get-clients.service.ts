import { API_ROUTE } from "@/constants/api-route.constant";
import type { ClientResponse } from "@/shared/clients/types/client.type";

export const getClients = async (page:number): Promise<ClientResponse> => {
  const response = await fetch(`${API_ROUTE}/clients?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des clients");
  }

  return response.json();
};
