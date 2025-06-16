import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { Client } from "@/shared/clients/types/client.type";

export const fetchClient = async (id: string): Promise<Client> => {
  const res = await apiFetch(`${API_ROUTE}/clients/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du client"
    );
  }

  return result;
};
