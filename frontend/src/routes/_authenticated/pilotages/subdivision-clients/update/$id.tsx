import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SubdivisionClientUpdateForm from "@/features/subdivision-clients/components/SubdivisionClientUpdateForm";
import { fetchSubdivisionClient } from "@/features/subdivision-clients/services/fetch-subdivision-client.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const subdivisionClientsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.SUBDIVISION_CLIENT_WITH_ID(id),
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
  errorComponent: ({ error }) => <FormError message={error.message} />,
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
