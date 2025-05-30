import { API_ROUTE } from "@/config";

// Fetch resources depuis le backend
export const fetchResources = async (): Promise<string[]> => {
  const res = await fetch(`${API_ROUTE}/roles/resources/`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des ressources");
  return res.json();
};