import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionType } from "../types/requisition-type.type";

export const fetchRequisitionType = async (id: string): Promise<RequisitionType> => {
  const res = await fetch(`${API_ROUTE}/requisition-types/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de réquisition"
    );
  }

  return result;
};
