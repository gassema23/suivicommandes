import type { PaginatedResponse } from "@/types/paginate-response.type";

export type ProviderDisponibility = {
  id: string;
  providerDisponibilityName: string;
  providerDisponibilityDescription?: string;
};

export type ProviderDisponibilityResponse =
  PaginatedResponse<ProviderDisponibility>;
