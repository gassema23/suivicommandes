import type { BackendPermission, Permission } from "./permission.type";

export interface BackendRole {
  id: string;
  roleName: string; // "admin" dans votre cas
  permissions: BackendPermission[];
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  deletedAt: string | null;
  deletedById: string | null;
}

export interface Role {
  id: string;
  roleName:string;
  permissions: Permission[];
}