import type { Client } from "@/features/clients/types/client.type";

export interface SubdivisionClient {
  id: string;
  clientId?: string;
  subdivisionClientName?: string;
  subdivisionClientNumber: string;
  virtualSubdivisionClientName?: string;
  client: Client;
}
