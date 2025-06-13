import { API_ROUTE } from "@/constants/api-route.constant";
import type { ServiceFormData } from "../schemas/service.schema";

export async function createService(data: ServiceFormData) {
  const res = await fetch(`${API_ROUTE}/services/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la création du service");
  }
  return result as ServiceFormData;
}
