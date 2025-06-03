import { API_ROUTE } from "@/config";
import type { ClientFormData } from "../schemas/clients.schema";

export const createClient = async (client: ClientFormData): Promise<void> => {
  if (!client.clientName || !client.clientNumber) {
    throw new Error("Le client et l'identifiant du client sont requis");
  }

  const response = await fetch(`${API_ROUTE}/clients`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la création du client"
    );
  }
  return response.json();
};
