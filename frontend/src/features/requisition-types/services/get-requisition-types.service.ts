import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionTypeResponse } from "../../../shared/requisition-types/types/requisition-type.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getRequisitionTypes = async (
  page: number
): Promise<RequisitionTypeResponse> => {
  const response = await apiFetch(`${API_ROUTE}/requisition-types?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de réquisition");
  }

  return response.json();
};
