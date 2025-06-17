import { createFileRoute } from "@tanstack/react-router";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SectorCreateForm from "@/features/sectors/components/SectorCreateForm";
import type { SectorsResponse } from "@/shared/sectors/types/sector.type";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/sectors/create"
)<SectorsResponse>({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un secteur" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un secteur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Services", href: "/pilotages/sectors" },
      {
        label: "Ajouter un secteur",
        href: "/pilotages/sectors/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={6} />,
});

function RouteComponent() {
  return <SectorCreateForm />;
}
