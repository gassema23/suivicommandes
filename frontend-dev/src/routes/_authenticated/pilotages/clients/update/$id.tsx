import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import ClientUpdateForm from "@/features/clients/components/ClientUpdateForm";
import { fetchClient } from "@/features/clients/services/fetch-client.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";

const clientsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.CLIENTS_WITH_ID(id),
    queryFn: () => fetchClient(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/clients/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CLIENTS.UPDATE]),

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(clientsQueryOptions(params.id)),
  head: () => ({
    meta: [{ title: "Modifier le client" }],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du client"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier le client",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Clients", href: "/pilotages/clients" },
      {
        label: "Modifier le client",
        href: "/pilotages/clients/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(clientsQueryOptions(id!));
  return <ClientUpdateForm client={data} />;
}
