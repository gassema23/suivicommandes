import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { getDeadline } from "../services/get-deadline.service";
import type { ProcessingTimeParams } from "../types/processing-deadline.type";

moment.locale("fr");

export function useCalculateDeadline({
  startDate,
  startTime,
  delayInDays,
}: ProcessingTimeParams) {

  /**
   * Hook pour calculer le délai de traitement d'une commande.
   *
   * @param requestTypeServiceCategoryId - Identifiant de la catégorie de service.
   * @param requestTypeDelayId - Identifiant du type de demande (optionnel).
   * @param order_registration_at - Date d'enregistrement de la commande (format YYYY-MM-DD).
   * @param order_registration_time - Heure d'enregistrement de la commande (format HH:mm).
   *
   * @returns Query pour récupérer le délai de traitement.
   */
  return useQuery({
    queryKey: QUERY_KEYS.PROCESSING_TIME_CALCULATION(
      startDate,
      startTime ?? "",
      delayInDays
    ),
    queryFn: () => getDeadline({ startDate, startTime, delayInDays }),
    enabled: !!(
      startDate &&
      startTime &&
      moment(startDate, "YYYY-MM-DD", true).isValid() &&
      moment(startTime, "HH:mm", true).isValid() &&
      delayInDays
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
