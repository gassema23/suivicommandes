import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ProcessingTimeParams } from "../types/processing-deadline.type";

// Fetch resources depuis le backend
export const getDeadline = async ({
  requestTypeServiceCategoryId,
  requestTypeDelayId,
  order_registration_at,
  order_registration_time,
}: ProcessingTimeParams) => {

  const res = await apiFetch(`${API_ROUTE}/deadline/get-data-to-calculate-deadline`, {
    method: "POST",
    body: JSON.stringify({
      requestTypeServiceCategoryId,
      requestTypeDelayId
    }),
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des clients");

    // Vérification de la réponse
    console.log(await res.json());

  return res.json();
};
