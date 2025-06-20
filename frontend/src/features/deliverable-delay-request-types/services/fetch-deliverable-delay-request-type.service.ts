import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayRequestTypeResponse } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";

export const fetchDeliverableDelayRequestType = async (
  id: string
): Promise<DeliverableDelayRequestTypeResponse> => {
  const response = await apiFetch(
    `${API_ROUTE}/deliverable-delay-request-types/${id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération du type de demande de délai de livrable"
    );
  }

  return response.json();
};
