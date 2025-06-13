import type { User } from "@/shared/users/types/user.type";
import type { PaginatedResponse } from "@/types/paginate-response.type";

export type Team = {
  id: string;
  teamName: string;
  teamDescription?: string;
  owner: User
}

export type TeamResponse = PaginatedResponse<Team>;