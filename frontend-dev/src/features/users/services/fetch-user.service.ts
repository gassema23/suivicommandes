import { API_ROUTE } from "@/config";
import type { User } from "../types/user.type";

export const fetchUser = async (id: string): Promise<User> => {
  const res = await fetch(`${API_ROUTE}/users/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'utilisateur"
    );
  }
  return result as User;
};
