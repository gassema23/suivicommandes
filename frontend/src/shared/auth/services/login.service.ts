import { API_ROUTE } from "@/constants/api-route.constant";
import type { LoginFormData } from "../schema/login.schema";
import { useCsrf } from "@/providers/csrf.provider"; // <-- importe le hook

export const useLogin = () => {
  const { ensureCsrfToken } = useCsrf();

  return async (credentials: LoginFormData): Promise<void> => {
    // 1. Récupère le token CSRF
    const csrfToken = await ensureCsrfToken();

    // 2. Envoie la requête de login avec le header CSRF
    const res = await fetch(`${API_ROUTE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
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
};