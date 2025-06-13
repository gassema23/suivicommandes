import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getRoles } from "@/shared/roles/services/get-roles.service";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { RoleList } from "@/features/roles/components/RoleList";
import type { RoleResponse } from "@/shared/roles/types/role.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { APP_NAME } from "@/constants/app-name.constant";

const rolesQueryOptions = queryOptions<RoleResponse>({
  queryKey: QUERY_KEYS.ROLES,
  queryFn: () => getRoles(),
});

export const Route = createFileRoute("/_authenticated/administrations/roles/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.READ]),
  head: () => ({
    meta: [
      { name: "description", content: "" },
      { title: `Rôles | ${APP_NAME}` },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient?.ensureQueryData(rolesQueryOptions),
  component: RolePage,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des rôles"
      message={error.message}
    />
  ),
  staticData: {
    title: "Rôles",
    action: "/administrations/roles/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Rôles", href: "/administrations/roles", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RolePage() {
  const { data: roles } = useSuspenseQuery<RoleResponse>(rolesQueryOptions);
  return (
    <div className="w-full">
      <RoleList roles={roles.data} />
    </div>
  );
}
