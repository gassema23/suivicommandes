import type { BackendRole, Role } from "@/features/roles/types/role.type";

export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  profileImage: string | null;
  emailVerifiedAt: string | null;
  twoFactorEnabled: boolean;
  role: BackendRole;
  roleId: string;
  team: any | null;
  teamId: string | null;
  teamIdRelation: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  deletedAt: string | null;
  deletedById: string | null;
}

export interface User {
  id: string;
  fullName: string;
  profilePicture?: string;
  email?: string;
  initials?: string;
  createdAt: string;
  role: Role;
}
