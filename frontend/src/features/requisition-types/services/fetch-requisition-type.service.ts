import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequisitionType } from "../../../shared/requisition-types/types/requisition-type.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchRequisitionType = async (id: string): Promise<RequisitionType> => {
  const res = await apiFetch(`${API_ROUTE}/requisition-types/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du type de réquisition"
    );
  }

  return result;
};
