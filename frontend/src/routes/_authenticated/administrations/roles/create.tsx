import LoadingPage from "@/components/ui/loader/LoadingPage";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { APP_NAME } from "@/constants/app-name.constant";
import RoleCreateForm from "@/features/roles/components/role-create-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administrations/roles/create")({
  beforeLoad: createPermissionGuard([PERMISSIONS.ROLES.CREATE]),
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Ajouter un rôle | ${APP_NAME}`,
      },
    ],
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

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  return <RoleCreateForm />;
}
