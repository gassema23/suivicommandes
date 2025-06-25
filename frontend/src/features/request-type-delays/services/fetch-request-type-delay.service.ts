import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelay } from "../../../shared/request-type-delays/types/request-type-delay.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchRequestTypeDelay= async (id: string): Promise<RequestTypeDelay> => {
  const res = await apiFetch(`${API_ROUTE}/request-type-delays/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du délai par type de demande"
    );
  }

  return result;
};
