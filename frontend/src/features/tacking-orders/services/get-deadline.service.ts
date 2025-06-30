import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

// Fetch resources depuis le backend

type DataToCalculateDeadline = {
  startDate: string;
  delayInDays: number;
};

export const getDeadline = async ({
  startDate,
  delayInDays,
}: DataToCalculateDeadline) => {
  const res = await apiFetch(`${API_ROUTE}/deadline/calculate`, {
    method: "POST",
    body: JSON.stringify({
      startDate,
      delayInDays,
    }),
  });

  if (!res.ok)
    throw new Error(
      "Erreur lors du chargement des données pour le calcul du délai"
    );

  return res.json();
};
