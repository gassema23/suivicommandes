import LoadingPage from "@/components/ui/loader/loading-page";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { fetchRole } from "@/features/roles/services/fetchRole";
import { createFileRoute } from "@tanstack/react-router";
import RoleUpdateForm from "@/features/roles/components/role-update-form";

export const Route = createFileRoute(
  "/_authenticated/administrations/roles/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.UPDATE]),
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
  loader: async ({ params }) => {
    return fetchRole(params.id);
  },
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
  const data = Route.useLoaderData();

  return (
    <div>
      <div>{data.roleName}</div>
      <RoleUpdateForm role={data} />
    </div>
  );
}
