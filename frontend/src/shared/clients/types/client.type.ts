import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Client = {
  id: string;
  clientName?: string;
  clientNumber: string;
  virtualClientName: string;
};

export type ClientResponse = PaginatedResponse<Client>;
