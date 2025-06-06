import { API_ROUTE } from "@/config";
import type { ClientResponse } from "../types/client.type";

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
