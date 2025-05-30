import { API_ROUTE } from "@/config";

export default async function logoutUser() {
  await fetch(`${API_ROUTE}/auth/logout`, { method: "POST", credentials: "include" });
}