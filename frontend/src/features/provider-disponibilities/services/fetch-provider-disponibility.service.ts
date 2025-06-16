import { API_ROUTE } from "@/constants/api-route.constant";
import type { ProviderDisponibility } from "../types/provider-disponibility.type";
import { apiFetch } from "@/hooks/useApiFetch";

export const fetchProviderDisponibility = async (
  id: string
): Promise<ProviderDisponibility> => {
  const res = await apiFetch(`${API_ROUTE}/provider-disponibilities/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la disponibilité fournisseur"
    );
  }

  return result;
};
