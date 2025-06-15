import type { PaginationState } from "@tanstack/react-table"

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PaginatedData<T> = {
  result: T[]
  rowCount: number
}

export type PaginationParams = PaginationState
export type SortParams = { sortBy: `${string}.${'asc' | 'desc'}` }
export type Filters<T> = Partial<T & PaginationParams & SortParams>
