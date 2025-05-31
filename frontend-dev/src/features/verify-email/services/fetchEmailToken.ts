import { API_ROUTE } from "@/config";

// Fetch resources depuis le backend
export const fetchEmailToken = async (token: string):Promise<string> => {

  const res = await fetch(`${API_ROUTE}/auth/verify-email?token=${token}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Erreur lors de la vérification du courriel");
  return res.json();
};