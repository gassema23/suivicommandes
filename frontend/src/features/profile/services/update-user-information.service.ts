import { API_ROUTE } from "@/constants/api-route.constant";
import type { UserInformationFormData } from "../schemas/user-information.schema";
import { useCsrfFetch } from "@/hooks/useCsrfFetch";

export function useUpdateUserInformation() {
  const csrfFetch = useCsrfFetch();

  return (id:string, data: UserInformationFormData) =>
    csrfFetch(`${API_ROUTE}/users/${id}`, {
      method: "PATCH",
      body: data,
    });
}
