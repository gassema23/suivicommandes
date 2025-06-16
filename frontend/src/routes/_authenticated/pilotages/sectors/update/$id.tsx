import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SectorUpdateForm from "@/features/sectors/components/SectorUpdateForm";
import { fetchSector } from "@/features/sectors/services/fetch-sector.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const sectorsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.SECTOR_WITH_ID(id),
    queryFn: () => fetchSector(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/sectors/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.UPDATE]),
  head: () => ({
    meta: [{ title: "Modifier le secteur" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le secteur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Secteur", href: "/pilotages/sectors" },
      {
        label: "Modifier le secteur",
        href: "/pilotages/sectors/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(sectorsQueryOptions(id!));
  return <SectorUpdateForm sector={data} />;
}
