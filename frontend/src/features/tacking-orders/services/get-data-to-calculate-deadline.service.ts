import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { DataToCalculateDeadline } from "../types/data-to-calculate-deadline.type";

// Fetch resources depuis le backend
export const getDataToCalculateDeadline = async ({
  requestTypeServiceCategoryId,
  requestTypeDelayId,
}: DataToCalculateDeadline) => {
  const res = await apiFetch(
    `${API_ROUTE}/deadline/data-to-calculate-deadline`,
    {
      method: "POST",
      body: JSON.stringify({
        requestTypeServiceCategoryId,
        requestTypeDelayId,
      }),
    }
  );

  if (!res.ok)
    throw new Error(
      "Erreur lors du chargement des données pour le calcul du délai"
    );
  return res.json();
};
