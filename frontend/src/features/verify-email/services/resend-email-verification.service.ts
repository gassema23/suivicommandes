import { API_ROUTE } from "@/constants/api-route.constant";
import { apiFetch } from "@/hooks/useApiFetch";

// Fetch resources depuis le backend
export const resendEmailVerification = async (data: {
  email: string;
  token: string;
}): Promise<string> => {
  const res = await apiFetch(`${API_ROUTE}/auth/resend-email-verification`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      result.message || "Erreur lors de la vérification du courriel"
    );
  }
  return result as string;
};
