import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { fetchRole } from "@/features/roles/services/fetch-role.service";
import { createFileRoute, useParams } from "@tanstack/react-router";
import RoleUpdateForm from "@/features/roles/components/role-update-form";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import LoadingTable from "@/components/ui/loader/LoadingTable";
import { fetchResources } from "@/features/roles/services/fetch-resources.service";

const rolesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.ROLE_WITH_ID(id),
    queryFn: () => fetchRole(id),
  });

const resourcesQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.RESOURCE,
    queryFn: fetchResources,
  });

export const Route = createFileRoute(
  "/_authenticated/administrations/roles/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(rolesQueryOptions(params.id)),
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Modifier le rôles" }],
  }),
  staticData: {
    title: "Modifier le rôle",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Rôles", href: "/administrations/roles" },
      {
        label: "Modifier le rôle",
        href: "/administrations/roles/update/$id",
        isCurrent: true,
      },
    ],
  },
  errorComponent: ({ error }) => <FormError message={error.message} />,
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(rolesQueryOptions(id!));
  const { data: resources } = useSuspenseQuery(resourcesQueryOptions());

  console.log(resources);

  const resourceValues = resources.map((r) => r.value);

  return <RoleUpdateForm role={data} data={resourceValues} />;
}
