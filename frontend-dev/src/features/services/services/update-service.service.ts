import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { ServiceFormData } from "../schemas/service.schema";

export async function updateService(serviceId: string, data: ServiceFormData) {
  const res = await fetch(`${API_ROUTE}/services/${serviceId}`, {
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
      result.message || "Erreur lors de la mise à jour du service"
    );
  }

  return result;
}
