import { useQuery } from "@tanstack/react-query";
import { API_ROUTE } from "@/features/common/constants/api-route.constant";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { useAuthStore } from "@/stores/auth.store";

export function useAuthFetch() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await fetch(`${API_ROUTE}/auth/me`, { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      setUser(data.user);
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
  });
}