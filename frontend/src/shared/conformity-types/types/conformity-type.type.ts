import type { PaginatedResponse } from "@/types/paginate-response.type";

export type ConformityType = {
  id: string;
  conformityTypeName: string;
  conformityTypeDescription?: string;
};

export type ConformityTypeResponse = PaginatedResponse<ConformityType>;
