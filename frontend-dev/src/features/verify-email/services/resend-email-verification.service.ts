import { API_ROUTE } from "@/features/common/constants/api-route.constant";

// Fetch resources depuis le backend
export const resendEmailVerification = async (data: {
  email: string;
  token: string;
}): Promise<string> => {
  const res = await fetch(`${API_ROUTE}/auth/resend-email-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
