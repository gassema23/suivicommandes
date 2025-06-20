import { API_ROUTE } from "@/constants/api-route.constant";
import type { FlowResponse } from "../../../shared/flow/types/flow.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const getFlows = async (page: number): Promise<FlowResponse> => {
  const response = await apiFetch(`${API_ROUTE}/flows?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des flux de transmission");
  }

  return response.json();
};
