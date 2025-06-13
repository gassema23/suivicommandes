import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ProviderDisponibilityUpdateForm from "@/features/provider-disponibilities/components/ProviderDisponibilityUpdateForm";
import { fetchProviderDisponibility } from "@/features/provider-disponibilities/services/fetch-provider-disponibility.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const providerDisponibilityQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.PROVIDER_DISPONIBILITY_WITH_ID(id),
    queryFn: () => fetchProviderDisponibility(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-disponibilities/update/$id"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.PROVIDER_DISPONIBILITIES.UPDATE,
  ]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      providerDisponibilityQueryOptions(params.id)
    ),
  head: () => ({
    meta: [{ title: "Modifier la disponibilité fournisseur" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier la disponibilité fournisseur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Disponibilités fournisseur",
        href: "/pilotages/provider-disponibilities",
      },
      {
        label: "Modifier la disponibilité fournisseur",
        href: "/pilotages/provider-disponibilities/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(providerDisponibilityQueryOptions(id!));
  return <ProviderDisponibilityUpdateForm providerDisponibility={data} />;
}
