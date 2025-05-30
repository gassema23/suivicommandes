import { API_ROUTE } from "@/config";
import type { Role } from "../types/role.type";

export const fetchRole = async (id: string): Promise<Role> => {
  const response = await fetch(`${API_ROUTE}/roles/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du role");
  }

  return response.json();
};
