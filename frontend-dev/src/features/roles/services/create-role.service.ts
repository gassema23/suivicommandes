import { API_ROUTE } from "@/features/common/constants/api-route.constant";

export interface CreateRoleRequest {
  roleName: string;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
}

export interface CreateRoleResponse {
  success: boolean;
  data: {
    id: string;
    roleName: string;
    permissions: Array<{
      id: string;
      resource: string;
      actions: string[];
    }>;
    createdAt: string;
  };
  message: string;
}

export const createRole = async (data: CreateRoleRequest): Promise<CreateRoleResponse> => {
    const response = await fetch(`${API_ROUTE}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }

  return response.json();
};