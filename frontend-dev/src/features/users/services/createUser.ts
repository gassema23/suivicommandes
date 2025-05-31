import { API_ROUTE } from "@/config";
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
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  }
  return res.json();
}
