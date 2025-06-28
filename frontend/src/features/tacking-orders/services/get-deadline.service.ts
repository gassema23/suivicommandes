import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { ProcessingTimeParams } from "../types/processing-deadline.type";
import moment from "moment";

// Fetch resources depuis le backend
export const getDeadline = async ({
  startDate,
  startTime,
  delayInDays,
}: ProcessingTimeParams) => {
  const formattedDate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";

  console.log(formattedDate);

  const res = await apiFetch(`${API_ROUTE}/deadline/calculate`, {
    method: "POST",
    body: JSON.stringify({
      startDate: formattedDate,
      startTime,
      delayInDays,
    }),
  });
  if (!res.ok)
    throw new Error(
      "Erreur lors du chargement des données pour le calcul du délai"
    );

  return res.json();
};
