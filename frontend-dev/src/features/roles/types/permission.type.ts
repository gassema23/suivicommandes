export interface PermissionCheck {
  resource: string;
  action: string;
}

export interface BackendPermission {
  id: string;
  resource: string;
  actions: string[]; // ["read", "create"] dans votre cas
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  deletedAt: string | null;
  deletedById: string | null;
}

export type Permission = {
  id: string;
  resource: string;
  actions: string[];
};

