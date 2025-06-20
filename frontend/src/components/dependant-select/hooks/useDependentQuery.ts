import { useQuery } from "@tanstack/react-query";

export function useDependentQuery<T>(
  queryKey: string[] | readonly string[],
  fetchFn: (id?: string) => Promise<T[]>,
  id?: string
) {
  const key = Array.isArray(queryKey) ? Array.from(queryKey) : [];
  return useQuery<T[]>({
    queryKey: id ? [...key, id] : key,
    queryFn: () => fetchFn(id),
    enabled: id !== undefined && id !== null && id !== "",
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
