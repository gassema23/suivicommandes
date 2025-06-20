import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DeliverableDelayRequestType } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";

export async function getDeliverableDelayRequestTypeByRequestTypeServiceCategory(
  id?: string
): Promise<DeliverableDelayRequestType[]> {
  const res = await apiFetch(
    `${API_ROUTE}/request-type-service-categories/${id}/deliverable-delay-request-types`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Erreur lors du chargement des types de demande de délai de livraison"
    );
  }

  return res.json();
}
