import type { BackendRole, Role } from "@/features/roles/types/role.type";
import type { Team } from "@/features/teams/types/team.type";

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
  firstName: string;
  lastName: string;
  profilePicture?: string;
  emailVerifiedAt?: string | null;
  email?: string;
  initials?: string;
  createdAt: string;
  role: Role;
  team: Team;
}
