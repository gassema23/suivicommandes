import type { RequestTypeDataToCalculateDeadline } from "@/shared/tacking-orders/types/data-to-calculate-deadline.type";

export type ProcessingTimeParams = {
  startDate: string;
  startTime: string;
  dataToCaculateDeadline: RequestTypeDataToCalculateDeadline;
};
