import { API_ROUTE } from "@/constants/api-route.constant";
import type { Provider } from "@/shared/providers/types/provider.type";

export const fetchProvider = async (id: string): Promise<Provider> => {
  const res = await fetch(`${API_ROUTE}/providers/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du fournisseur"
    );
  }

  return result;
};
