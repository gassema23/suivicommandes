import { API_ROUTE } from "@/config";
import type { Service } from "../types/service.type";

export const fetchService = async (id: string): Promise<Service> => {
  const res = await fetch(`${API_ROUTE}/services/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération du service"
    );
  }

  return result;
};
