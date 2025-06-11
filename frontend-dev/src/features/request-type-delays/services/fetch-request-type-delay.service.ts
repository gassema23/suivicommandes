import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestTypeDelay } from "../types/request-type-delay.type";

export const fetchRequestTypeDelay= async (id: string): Promise<RequestTypeDelay> => {
  const res = await fetch(`${API_ROUTE}/request-type-delays/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du délai par type de demande"
    );
  }

  return result;
};
