import LoadingPage from "@/components/ui/loader/loading-page";
import { Badge } from "@/components/ui/quebec/Badge";
import { Card, CardContent } from "@/components/ui/quebec/Card";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import UserAvatar from "@/features/users/components/user-avatar";
import { getUsers } from "@/features/users/services/getUsers";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Mail, MoreHorizontal, Shield } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { z } from "zod";
import { Pagination } from "@/components/ui/quebec/Pagination";
import NoData from "@/components/ui/quebec/no-data";

// Schema de validation pour les paramètres de recherche
const usersSearchSchema = z.object({
  page: z.number().min(1).optional().default(1),
  startsWith: z.string().optional().default("A-E"),
});

const usersQueryOptions = (page: number, startsWith?: string) =>
  queryOptions({
    queryKey: ["users", page, startsWith],
    queryFn: () => getUsers({ page, startsWith }),
  });

export const Route = createFileRoute("/_authenticated/pilotages/users/")({
  // Validation des paramètres de recherche
  validateSearch: usersSearchSchema,

  beforeLoad: createPermissionGuard([PERMISSIONS.USERS.READ]),

  head: () => ({
    meta: [
      { name: "description", content: "" },
      { title: `Utilisateurs | ${APP_NAME}` },
    ],
  }),

  loader: ({ context }) => {
    const page = context.search?.page ?? 1;
    return context.queryClient.ensureQueryData(usersQueryOptions(page));
  },

  component: RouteComponent,

  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des utilisateurs"
      message={error.message}
    />
  ),

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
  const { page, startsWith } = Route.useSearch();
  const { navigate } = useRouter();
  const { data } = useSuspenseQuery(usersQueryOptions(page, startsWith));
  const goToPage = (newPage: number) => {
    navigate({ search: { page: newPage, startsWith } });
  };

  const goToLetter = (letter: string) => {
    navigate({ search: { page: 1, startsWith: letter } });
  };

  console.log("Data fetched:", data);
  return (
    <div>
      {data.data.length == 0 && (
        <NoData withImage>
          Aucun utilisateur trouvé pour la plage de lettres {startsWith}.
        </NoData>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.data.map((user) => (
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
                  <div className="capitalize">
                    {user.role?.roleName || "Aucun rôle"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={goToPage}
          variant="alphabetic"
          currentLetter={startsWith}
          onLetterChange={goToLetter}
        />
      </div>
    </div>
  );
}
