import { API_ROUTE } from "@/constants/api-route.constant";
import type { Client } from "@/shared/clients/types/client.type";

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
