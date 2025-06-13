import { API_ROUTE } from "@/constants/api-route.constant";
import type { LoginFormData } from "../schema/login.schema";

export const login = async (credentials: LoginFormData): Promise<void> => {
  const res = await fetch(`${API_ROUTE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message ||
        "Impossible de se connecter. Vérifiez vos identifiants et réessayez."
    );
  }
  return res.json();
};
