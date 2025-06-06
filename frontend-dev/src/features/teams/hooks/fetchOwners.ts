import { API_ROUTE } from "@/config";
import type { User } from "@/features/users/types/user.type";

// Fetch resources depuis le backend
export const fetchOwners = async (): Promise<User[]> => {
  const res = await fetch(`${API_ROUTE}/users/usersList?role=admin,pilotage`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des ressources");
  return res.json();
};