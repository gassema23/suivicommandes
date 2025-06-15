import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserResponse } from "@/shared/users/types/user.type";

export const getUsers = async (): Promise<UserResponse> => {
  const res = await fetch(`${API_ROUTE}/users`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'utilisateur"
    );
  }
  return result;
};
