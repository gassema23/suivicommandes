import type { BackendRole, Role } from "@/shared/roles/types/role.type";
import type { Team } from "@/shared/teams/types/team.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type BackendUser = {
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
  team: Team | null;
  teamId: string | null;
  teamIdRelation: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  deletedAt: string | null;
  deletedById: string | null;
};

export type User = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  emailVerifiedAt?: string | null;
  email?: string;
  initials?: string;
  createdAt: string;
  role: Role;
  team: Team;
};

export type UserResponse = PaginatedResponse<User>;
