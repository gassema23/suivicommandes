import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelayResponse } from "../../../shared/request-type-delays/types/request-type-delay.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getRequestTypeDelays = async (
  page: number
): Promise<RequestTypeDelayResponse> => {
  const response = await apiFetch(
    `${API_ROUTE}/request-type-delays?page=${page}`,
    {
      method: "GET"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger les délais par type de demande. Veuillez réessayer plus tard."
    );
  }

  return response.json();
};
