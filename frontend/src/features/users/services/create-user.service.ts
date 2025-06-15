import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserFormData } from "../schemas/user.schema";

export async function createUser(data: UserFormData) {
  const res = await fetch(`${API_ROUTE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de la mise à jour de l'utilisateur");
  }
  return result as UserFormData;
}
