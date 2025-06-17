import type { Role } from "@/shared/roles/types/role.type";
import type { Team } from "@/shared/teams/types/team.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type User = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  emailVerifiedAt?: string | null;
  email: string;
  initials: string;
  createdAt: string;
  role: Role;
  team: Team;
};

export type UserResponse = PaginatedResponse<User>;
