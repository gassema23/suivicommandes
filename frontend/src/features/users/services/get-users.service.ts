import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { UserResponse } from "@/shared/users/types/user.type";

export const getUsers = async (page: number): Promise<UserResponse> => {
  const res = await apiFetch(`${API_ROUTE}/users?page=${page}`, {
    method: "GET",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'utilisateur"
    );
  }
  return result;
};
