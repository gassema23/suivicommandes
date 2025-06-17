import { Badge } from "@/components/ui/quebec/Badge";
import { Card, CardContent } from "@/components/ui/quebec/Card";
import UserAvatar from "@/components/ui/quebec/UserAvatar";
import { Calendar, Mail } from "lucide-react";
import UserInformationCard from "./UserInformationCard";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import type { User } from "@/shared/users/types/user.type";
import { capitalizeFirstLetter } from "@/lib/utils";
import UserDropDownMenu from "./UserDropDownMenu";

export default function UserCard({ user }: { user: User }) {
  momentFr();
  if (!user) return null;
  return (
    <Card key={user.id} className="w-full" elevation={1}>
      <CardContent>
        <div className="w-full justify-between flex items-start gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar size="xl" user={user} />
            <div>
              <div className="font-semibold text-lg">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">
                {user.team.teamName}
              </div>
            </div>
          </div>
          <div>
            <UserDropDownMenu userId={user.id} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {user.emailVerifiedAt ? (
            <Badge variant="success">Adresse courriel vérifiée</Badge>
          ) : (
            <Badge variant="warning">Adresse courriel non vérifiée</Badge>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <UserInformationCard icon={Mail} information={user.email} />
          <UserInformationCard
            icon={Calendar}
            information={`Rejoint le ${moment(user.createdAt).format("LL")}`}
          />
        </div>
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground border-t border-muted pt-2 mt-2">
          <div className="font-semibold">Rôle</div>
          <div>{capitalizeFirstLetter(user.role?.roleName) || "N/A"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
