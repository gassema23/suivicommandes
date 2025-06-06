import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequestType } from "../types/request-type.type";

export const fetchRequestType = async (id: string): Promise<RequestType> => {
  const res = await fetch(`${API_ROUTE}/request-types/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de demande"
    );
  }

  return result;
};
