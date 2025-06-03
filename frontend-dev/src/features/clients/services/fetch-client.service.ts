import { API_ROUTE } from "@/config";
import type { Client } from "../types/client.type";

export const fetchClient = async (id: string): Promise<Client> => {
  const res = await fetch(`${API_ROUTE}/clients/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du client"
    );
  }

  return result;
};
