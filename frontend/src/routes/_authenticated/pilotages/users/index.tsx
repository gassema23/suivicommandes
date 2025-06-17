import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { getUsers } from "@/features/users/services/get-users.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pagination } from "@/components/ui/quebec/Pagination";
import NoData from "@/components/ui/quebec/NoData";
import type { UserResponse } from "@/shared/users/types/user.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import UserCard from "@/features/users/components/UserCard";
import LoadingCard from "@/components/ui/loader/LoadingCard";

const usersQueryOptions = (pageNumber: number) =>
  queryOptions<UserResponse>({
    queryKey: QUERY_KEYS.USERS_WITH_PAGE(pageNumber),
    queryFn: () => getUsers(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/users/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.USERS.READ]),
  head: () => ({
    meta: [{ title: "Utilisateurs" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
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
  pendingComponent: () => <LoadingCard />,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: users } = useSuspenseQuery<UserResponse>(
    usersQueryOptions(pageNumber)
  );

  return (
    <div>
      {users.data.length == 0 && (
        <NoData withImage>Aucun utilisateur trouvé.</NoData>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {users.data.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={users.meta.page}
          totalPages={users.meta.totalPages}
          onPageChange={(page) => navigate({ search: { page } })}
        />
      </div>
    </div>
  );
}
