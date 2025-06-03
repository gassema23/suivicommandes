import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import SectorUpdateForm from "@/features/sectors/components/SectorUpdateForm";
import { fetchSector } from "@/features/sectors/services/fetch-sector.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const sectorsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["sectors", id],
    queryFn: () => fetchSector(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/sectors/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.UPDATE]),

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(sectorsQueryOptions(params.id)),
  head: () => ({
    meta: [{title: `Modifier le secteur | ${APP_NAME}`}],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du secteur"
      message={error.message}
    />
  ),
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
