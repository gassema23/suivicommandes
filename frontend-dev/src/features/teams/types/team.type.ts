import type { User } from "@/features/users/types/user.type";

export interface Team {
  id: string;
  teamName: string;
  teamDescription?: string;
  owner: User
}