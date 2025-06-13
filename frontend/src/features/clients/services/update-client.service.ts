import { API_ROUTE } from "@/constants/api-route.constant";
import type { ClientFormData } from "../schemas/clients.schema";

export async function updateClient(clientId: string, data: ClientFormData) {
  const res = await fetch(`${API_ROUTE}/clients/${clientId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du jour férié"
    );
  }

  return result;
}
