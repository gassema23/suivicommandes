
import type { User } from "../types/user.type";
import { API_ROUTE } from "@/config";

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(
      `${API_ROUTE}/users`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }

    return response.json();
  },
};
