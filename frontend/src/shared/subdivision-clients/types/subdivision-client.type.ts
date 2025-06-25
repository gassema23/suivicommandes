import type { Client } from "@/shared/clients/types/client.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type SubdivisionClient = {
  id: string;
  clientId?: string;
  subdivisionClientName?: string;
  subdivisionClientNumber: string;
  virtualSubdivisionClientName?: string;
  client: Client;
};

export type SubdivisionClientResponse = PaginatedResponse<SubdivisionClient>;
