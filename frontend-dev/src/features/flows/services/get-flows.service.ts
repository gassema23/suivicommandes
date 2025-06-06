import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import type { FlowResponse } from "../types/flow.type";

export const getFlows = async (page: number): Promise<FlowResponse> => {
  const response = await fetch(`${API_ROUTE}/flows?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des flux de transmission");
  }

  return response.json();
};
