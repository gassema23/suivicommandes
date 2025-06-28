import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import type { DataToCalculateDeadline } from "../types/data-to-calculate-deadline.type";
import { getDataToCalculateDeadline } from "../services/get-data-to-calculate-deadline.service";

moment.locale("fr");

export function useGetDataToCalculateDeadline({
  requestTypeServiceCategoryId,
  requestTypeDelayId,
}: DataToCalculateDeadline) {

  /**
   * Hook pour récupérer les données nécessaires au calcul du délai de traitement d'une commande.
   *
   * @param requestTypeServiceCategoryId - Identifiant de la catégorie de service de la demande.
   * @param requestTypeDelayId - Identifiant du type de délai de la demande (optionnel).
   *
   * @returns Query pour récupérer les données nécessaires au calcul du délai.
   */
  return useQuery({
    queryKey: QUERY_KEYS.GET_DATA_TO_CALCULATE_DEADLINE(
      requestTypeServiceCategoryId,
      requestTypeDelayId
    ),
    queryFn: async () =>
      getDataToCalculateDeadline({
        requestTypeServiceCategoryId,
        requestTypeDelayId,
      }),
    enabled: !!requestTypeServiceCategoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
