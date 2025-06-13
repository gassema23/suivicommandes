import { API_ROUTE } from "@/constants/api-route.constant";
import type { PasswordFormData } from "../schemas/password.schema";

export async function updatePassword(userId: string, data: PasswordFormData) {
  console.log("Updating password for user:", userId, "with data:", data);
  const res = await fetch(`${API_ROUTE}/auth/update-password/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Erreur lors de l'activation du 2FA");
  }
  return result;
}
