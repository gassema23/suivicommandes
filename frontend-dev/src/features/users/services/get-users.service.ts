import { API_ROUTE } from "@/config";
import type { UserResponse } from "../types/user.type";

interface GetUsersParams {
  page?: number;
}

export const getUsers = async ({
  page = 1,
}: GetUsersParams): Promise<UserResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));

  const res = await fetch(`${API_ROUTE}/users?${params.toString()}`, {
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
