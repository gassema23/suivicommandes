import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { getDeadline } from "../services/get-deadline.service";
import type { ProcessingTimeParams } from "../types/processing-deadline.type";

// ✅ Configuration de moment en français
moment.locale("fr");

export function useCalculateDeadline({
  requestTypeServiceCategoryId,
  requestTypeDelayId,
  order_registration_at,
  order_registration_time,
}: ProcessingTimeParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PROCESSING_TIME_CALCULATION(
      requestTypeServiceCategoryId,
      requestTypeDelayId || "",
      order_registration_at,
      order_registration_time
    ),
    queryFn: () =>
      getDeadline({
        requestTypeServiceCategoryId,
        requestTypeDelayId,
        order_registration_at,
        order_registration_time,
      }),
    enabled: !!(
      requestTypeServiceCategoryId &&
      order_registration_at &&
      order_registration_time &&
      moment(order_registration_at, "YYYY-MM-DD", true).isValid() &&
      moment(order_registration_time, "HH:mm", true).isValid()
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
