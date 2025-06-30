import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { getDeadline } from "../services/get-deadline.service";
import type { ProcessingTimeParams } from "@/shared/tacking-orders/types/processing-deadline.type";
import { calculateDelayInDay } from "@/lib/calculate-delay-in-day";

moment.locale("fr");

export function useCalculateDeadline({
  startDate,
  startTime,
  dataToCaculateDeadline,
}: ProcessingTimeParams) {
  /**
   * Hook pour calculer le délai de traitement d'une commande.
   *
   * @param startDate - Date de début du traitement au format "YYYY-MM-DD".
   * @param startTime - Heure de début du traitement au format "HH:mm".
   * @param delayInDays - Délai de traitement en jours.
   *
   * @returns Query pour récupérer le délai de traitement.
   */
  const formattedDate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";

  return useQuery({
    queryKey: QUERY_KEYS.PROCESSING_TIME_CALCULATION(
      startDate,
      startTime,
      dataToCaculateDeadline
    ),
    queryFn: () => {
      const delayInDays = calculateDelayInDay(
        startTime,
        dataToCaculateDeadline.minimumRequiredDelay,
        dataToCaculateDeadline.sectorClientTimeEnd
      );
      return getDeadline({
        startDate: formattedDate,
        delayInDays,
      });
    },
    enabled: !!(
      startDate &&
      startTime &&
      moment(startDate, "YYYY-MM-DD", true).isValid() &&
      !dataToCaculateDeadline?.isAutoCalculate
    ),
  });
}
