import { API_ROUTE } from "@/constants/api-route.constant";
import type { Provider } from "@/shared/providers/types/provider.type";

export const fetchProvidersList= async (): Promise<Provider> => {
  const res = await fetch(`${API_ROUTE}/providers/providersList`, {
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
