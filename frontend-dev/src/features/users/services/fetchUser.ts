import { API_ROUTE } from "@/config";
import type { User } from "../types/user.type";

export const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`${API_ROUTE}/users/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }

  return response.json();
};
