import type { PaginatedResponse } from "@/types/paginate-response.type";

export type DelayType = {
  id: string;
  delayTypeName: string;
  delayTypeDescription?: string;
};

export type DelayTypeResponse = PaginatedResponse<DelayType>;
