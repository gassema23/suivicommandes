import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ClientFormData } from "../schemas/clients.schema";

export async function createClient(data: ClientFormData) {
  const res = await apiFetch(`${API_ROUTE}/clients`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du client");
  }
  return result as ClientFormData;
}
