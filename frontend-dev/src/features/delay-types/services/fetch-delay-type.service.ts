import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { DelayType } from "../types/delay-type.type";

export const fetchDelayType = async (id: string): Promise<DelayType> => {
  const res = await fetch(`${API_ROUTE}/delay-types/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de délai"
    );
  }

  return result;
};
