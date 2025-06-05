import { useQuery } from "@tanstack/react-query";

export function useDependentQuery<T>(
  queryKey: any,
  fetchFn: (id?: string) => Promise<T[]>,
  id?: string
) {
  return useQuery<T[]>({
    queryKey: id ? [...queryKey, id] : queryKey,
    queryFn: () => fetchFn(id),
    enabled: id !== undefined && id !== null && id !== "",
    staleTime: 5 * 60 * 1000,
  });
}