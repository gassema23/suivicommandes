import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import RequestTypeDelayUpdateForm from "@/features/request-type-delays/components/RequestTypeDelayUpdateForm";
import { fetchRequestTypeDelay } from "@/features/request-type-delays/services/fetch-request-type-delay.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const requestTypeDelaysQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.REQUEST_TYPE_DELAY_WITH_ID(id),
    queryFn: () => fetchRequestTypeDelay(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-type-delays/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPE_DELAYS.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      requestTypeDelaysQueryOptions(params.id)
    ),
  head: () => ({
    meta: [{ title: "Modifier le délai par type de demande" }],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du délai par type de demande"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier le délai par type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délais par type de demande",
        href: "/pilotages/request-type-delays",
      },
      {
        label: "Modifier le délai",
        href: "/pilotages/request-type-delays/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(requestTypeDelaysQueryOptions(id!));
  return <RequestTypeDelayUpdateForm requestTypeDelay={data} />;
}
