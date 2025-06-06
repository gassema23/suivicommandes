import { API_ROUTE } from "@/config";
import type { ProviderResponse } from "../types/provider.type";

export const getProviders = async (page:number): Promise<ProviderResponse> => {
  const response = await fetch(`${API_ROUTE}/providers?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des fournisseurs");
  }

  return response.json();
};
