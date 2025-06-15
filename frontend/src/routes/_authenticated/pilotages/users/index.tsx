import LoadingPage from "@/components/ui/loader/LoadingPage";
import { Badge } from "@/components/ui/quebec/Badge";
import { Card, CardContent } from "@/components/ui/quebec/Card";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import UserAvatar from "@/components/ui/quebec/UserAvatar";
import { getUsers } from "@/features/users/services/get-users.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MoreHorizontal, Shield } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Pagination } from "@/components/ui/quebec/Pagination";
import NoData from "@/components/ui/quebec/NoData";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { UserResponse } from "@/shared/users/types/user.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";

const usersQueryOptions = queryOptions<UserResponse>({
  queryKey: QUERY_KEYS.USERS,
  queryFn: getUsers,
});

export const Route = createFileRoute("/_authenticated/pilotages/users/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.USERS.READ]),
  head: () => ({
    meta: [{ title: "Utilisateurs" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(usersQueryOptions),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Utilisateurs",
    action: "/pilotages/users/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Utilisateurs", href: "/pilotages/users", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const { data: users } = useSuspenseQuery<UserResponse>(usersQueryOptions);
  return (
    <div>
      {users.data.length == 0 && (
        <NoData withImage>Aucun utilisateur trouvé.</NoData>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {users.data.map((user) => (
          <Card key={user.id} className="w-full" elevation={1}>
            <CardContent>
              <div className="flex justify-end w-full">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    {/* Placeholder for status badge, can be customized based on user status */}
                    {user.emailVerifiedAt ? (
                      <Badge variant="success">Email vérifié</Badge>
                    ) : (
                      <Badge variant="warning">Email non vérifié</Badge>
                    )}
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" align="start">
                        <DropdownMenuLabel>Plus d’actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Modifier le rôle</DropdownMenuItem>
                        <DropdownMenuItem>Modifier l'équipe</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Désactiver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <UserAvatar size="xxl" user={user} />
                <div className="mt-1 text-lg font-semibold text-center">
                  {user.fullName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.team?.teamName || "Aucune équipe assignée"}
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start bg-secondary text-secondary-foreground p-4 gap-2 text-sm elevation-1">
                <div className="flex items-center gap-x-4">
                  <Mail className="h-4 w-4" />
                  <div>{user.email}</div>
                </div>
                <div className=" flex items-center gap-x-4">
                  <Shield className="h-4 w-4" />
                  <div>
                    {capitalizeFirstLetter(user.role?.roleName) || "Aucun rôle"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={users.meta.page}
          totalPages={users.meta.totalPages}
        />
      </div>
    </div>
  );
}
