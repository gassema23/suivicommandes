import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { RequestTypeDelay } from "../types/request-type-delay.type";

export async function getRequestTypeDelaysByRequestType(
  id?: string
): Promise<RequestTypeDelay[]> {
  const res = await apiFetch(
    `${API_ROUTE}/request-type-delays/request-type-delays-by-request-type/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Erreur lors du chargement des délais de type de demande par type de demande"
    );
  }

  return res.json();
}
