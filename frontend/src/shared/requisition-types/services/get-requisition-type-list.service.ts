import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionType } from "../../../shared/requisition-types/types/requisition-type.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getRequisitionTypeList = async (): Promise<RequisitionType[]> => {

  const response = await apiFetch(`${API_ROUTE}/requisition-types/requisition-type-list`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des types de réquisition");
  }

  return response.json();
};
