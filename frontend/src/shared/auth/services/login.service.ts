import { API_ROUTE } from "@/constants/api-route.constant";
import type { LoginFormData } from "../schema/login.schema";
import { useCsrf } from "@/providers/csrf.provider";

export const useLogin = () => {
  const { ensureCsrfToken } = useCsrf();

  return async (credentials: LoginFormData): Promise<void> => {
    const csrfToken = await ensureCsrfToken();

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

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
  };
};
