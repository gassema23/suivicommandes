import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayFlowResponse } from "@/shared/deliverable-delay-flows/types/deliverable-delay-flow.type";

export const fetchDeliverableDelayFlow = async (
  id: string
): Promise<DeliverableDelayFlowResponse> => {
  const response = await apiFetch(
    `${API_ROUTE}/deliverable-delay-flows/${id}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération du délai de livraison des flux"
    );
  }

  return response.json();
};
