import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Holiday = {
  id: string;
  holidayName: string;
  holidayDate: Date;
  holidayDescription?: string;
};

export type HolidayResponse = PaginatedResponse<Holiday>;
