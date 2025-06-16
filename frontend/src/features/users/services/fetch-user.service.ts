import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { User } from "@/shared/users/types/user.type";

export const fetchUser = async (id: string): Promise<User> => {
  const res = await apiFetch(`${API_ROUTE}/users/${id}`, {
    method: "GET",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la récupération de l'utilisateur"
    );
  }
  return result as User;
};
