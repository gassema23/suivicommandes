import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import SubdivisionClientUpdateForm from "@/features/subdivision-clients/components/SubdivisionClientUpdateForm";
import { fetchSubdivisionClient } from "@/features/subdivision-clients/services/fetch-subdivision-client.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const subdivisionClientsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["subdivisionClients", id],
    queryFn: () => fetchSubdivisionClient(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      subdivisionClientsQueryOptions(params.id)
    ),
  head: () => ({
    meta: [{ title: "Modifier la subdivision client" }],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement de la subdivision client"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier la subdivision client",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Subdivision client", href: "/pilotages/subdivision-clients" },
      {
        label: "Modifier la subdivision client",
        href: "/pilotages/subdivision-clients/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(subdivisionClientsQueryOptions(id!));
  return <SubdivisionClientUpdateForm subdivisionClient={data} />;
}
