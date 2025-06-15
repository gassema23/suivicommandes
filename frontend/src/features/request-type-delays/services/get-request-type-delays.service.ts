import { API_ROUTE } from "@/constants/api-route.constant";
import type { RequestTypeDelayResponse } from "../types/request-type-delay.type";

export const getRequestTypeDelays = async (
  page: number
): Promise<RequestTypeDelayResponse> => {
  const response = await fetch(
    `${API_ROUTE}/request-type-delays?page=${page}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger les délais par type de demande. Veuillez réessayer plus tard."
    );
  }

  return response.json();
};