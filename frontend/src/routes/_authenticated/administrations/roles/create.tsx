import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import RoleCreateForm from "@/features/roles/components/role-create-form";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchResources } from "@/features/roles/services/fetch-resources.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import LoadingTable from "@/components/ui/loader/LoadingTable";

const resourcesQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.RESOURCE,
    queryFn: fetchResources,
  });

export const Route = createFileRoute(
  "/_authenticated/administrations/roles/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un rôle" }],
  }),
  staticData: {
    title: "Ajouter un rôles",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Rôles", href: "/administrations/roles" },
      {
        label: "Ajouter un rôle",
        href: "/administrations/roles/create",
        isCurrent: true,
      },
    ],
  },
  errorComponent: ({ error }) => <FormError message={error.message} />,
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: resources } = useSuspenseQuery(resourcesQueryOptions());
  const resourceValues = resources.map((r) => r.value);

  return <RoleCreateForm data={resourceValues} />;
}
