import LoadingPage from "@/components/ui/loader/loading-page";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { fetchRole } from "@/features/roles/services/fetchRole";
import { createFileRoute, useParams } from "@tanstack/react-router";
import RoleUpdateForm from "@/features/roles/components/role-update-form";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const rolesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["roles", id],
    queryFn: () => fetchRole(id),
  });

export const Route = createFileRoute(
  "/_authenticated/administrations/roles/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(rolesQueryOptions(params.id)),
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Modifier le rôles | ${APP_NAME}`,
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du rôle"
      message={error.message}
    />
  ),
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

  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(rolesQueryOptions(id!));

  return (
    <div>
      <div>{data.roleName}</div>
      <RoleUpdateForm role={data} />
    </div>
  );
}
