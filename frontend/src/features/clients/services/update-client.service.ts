import { API_ROUTE } from "@/constants/api-route.constant";
import type { ClientFormData } from "../schemas/clients.schema";
import { apiFetch } from "@/hooks/useApiFetch";

export async function updateClient(id: string, data: ClientFormData) {
  const res = await apiFetch(`${API_ROUTE}/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la mise à jour du client"
    );
  }
  return result as ClientFormData;
}
