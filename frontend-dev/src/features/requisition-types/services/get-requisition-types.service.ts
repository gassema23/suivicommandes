import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { RequisitionTypeResponse } from "../types/requisition-type.type";

export const getRequisitionTypes = async (
  page: number
): Promise<RequisitionTypeResponse> => {
  const response = await fetch(`${API_ROUTE}/requisition-types?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de réquisition");
  }

  return response.json();
};
