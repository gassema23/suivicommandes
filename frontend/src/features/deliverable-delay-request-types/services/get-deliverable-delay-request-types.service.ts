import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayRequestTypeResponse } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";

export const getDeliverableDelayRequestTypes = async (
  page: number
): Promise<DeliverableDelayRequestTypeResponse> => {
  const response = await apiFetch(
    `${API_ROUTE}/deliverable-delay-request-types?page=${page}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des types de demande de délai de livrable"
    );
  }

  return response.json();
};
