import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Provider = {
  id: string;
  providerName: string;
  providerCode?: string;
};

export type ProviderResponse = PaginatedResponse<Provider>;
