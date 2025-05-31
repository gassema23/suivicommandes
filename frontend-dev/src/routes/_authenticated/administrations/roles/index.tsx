import LoadingPage from "@/components/ui/loader/loading-page";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getRoles } from "@/features/roles/services/getRoles";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { RoleList } from "@/features/roles/components/RoleList";

const rolesQueryOptions = queryOptions({
  queryKey: ["roles"],
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

  const { data: roles = { data: [] } } = useSuspenseQuery(rolesQueryOptions);
  return (
    <div className="w-full">
      <RoleList roles={roles.data} />
    </div>
  );
}
