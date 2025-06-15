import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestType } from "@/shared/request-types/types/request-type.type";

// Fetch resources depuis le backend
export const fetchRequestTypeList = async (): Promise<RequestType[]> => {
  const res = await fetch(`${API_ROUTE}/request-types/requestTypeList`, {
    method: "GET",
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors du chargement des types de demande");
  return result;
};