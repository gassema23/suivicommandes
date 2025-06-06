import { API_ROUTE } from "@/features/common/constants/api-route.constant";

export default async function logoutUser() {
  await fetch(`${API_ROUTE}/auth/logout`, { method: "POST", credentials: "include" });
}