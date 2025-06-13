import type { Client } from "@/shared/clients/types/client.type";
import { API_ROUTE } from "@/constants/api-route.constant";

// Fetch resources depuis le backend
export const fetchClients = async (): Promise<Client[]> => {
  const res = await fetch(`${API_ROUTE}/clients/clientsList`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des clients");
  return res.json();
};
