import { API_ROUTE } from "@/config";
import type { User } from "../types/user.type";


interface GetUsersParams {
  page?: number;
  startsWith?: string;
}

export const getUsers = async ({ page = 1, startsWith }: GetUsersParams): Promise<{ data: User[]; meta: any }> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (startsWith) {
    params.append("startsWith", startsWith);
  }

  const response = await fetch(`${API_ROUTE}/users?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }

  return response.json();
};