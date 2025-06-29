import { API_ROUTE } from "@/constants/api-route.constant";
import type { ConformityType } from "@/shared/conformity-types/types/conformity-type.type";

export const fetchConformityType = async (id: string): Promise<ConformityType> => {
  const res = await fetch(`${API_ROUTE}/conformity-types/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de conformité"
    );
  }

  return result;
};
