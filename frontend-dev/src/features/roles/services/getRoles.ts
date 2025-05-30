import { API_ROUTE } from "@/config";
import type { Role } from "../types/role.type";

export const getRoles = async (): Promise<{ data: Role[] }> => {
  const response = await fetch(`${API_ROUTE}/roles`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des roles");
  }

  return response.json();
};
