import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DelayType } from "@/shared/delay-types/types/delay-type.type";

export const fetchDelayType = async (id: string): Promise<DelayType> => {
  const res = await apiFetch(`${API_ROUTE}/delay-types/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de délai"
    );
  }

  return result;
};
