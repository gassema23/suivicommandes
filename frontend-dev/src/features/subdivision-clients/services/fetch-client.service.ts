import { API_ROUTE } from "@/config";
import type { Client } from "@/features/clients/types/client.type";

// Fetch resources depuis le backend
export const fetchClients = async (): Promise<Client[]> => {
  const res = await fetch(`${API_ROUTE}/clients/clientsList`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des clients");
  return res.json();
};
