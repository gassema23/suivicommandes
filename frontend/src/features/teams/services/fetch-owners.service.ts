import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";
import type { User } from "@/shared/users/types/user.type";

// Fetch resources depuis le backend
export const fetchOwners = async (): Promise<User[]> => {
  const res = await apiFetch(
    `${API_ROUTE}/users/usersList?role=admin,pilotage`,
    {
      method: "GET",
    }
  );
  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(
      errorResponse.message || "Erreur lors de la récupération des propriétaires"
    );
  }

  return res.json();
};
