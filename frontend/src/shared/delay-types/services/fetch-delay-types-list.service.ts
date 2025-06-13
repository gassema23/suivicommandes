import { API_ROUTE } from "@/constants/api-route.constant";
import type { DelayType } from "@/shared/delay-types/types/delay-type.type";

export const fetchDelayTypesList = async (): Promise<DelayType> => {
  const res = await fetch(`${API_ROUTE}/delay-types/delay-types-list`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la liste des types de délai"
    );
  }

  return result;
};
