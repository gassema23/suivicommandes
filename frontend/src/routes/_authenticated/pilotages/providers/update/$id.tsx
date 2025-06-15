import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ProviderUpdateForm from "@/features/providers/components/ProviderUpdateForm";
import { fetchProvider } from "@/features/providers/services/fetch-provider.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const providersQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.PROVIDER_WITH_ID(id),
    queryFn: () => fetchProvider(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/providers/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.PROVIDERS.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(providersQueryOptions(params.id)),
  head: () => ({
    meta: [{ title: "Modifier le fournisseur" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le fournisseur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Fournisseur", href: "/pilotages/providers" },
      {
        label: "Modifier le fournisseur",
        href: "/pilotages/providers/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(providersQueryOptions(id!));
  return <ProviderUpdateForm provider={data} />;
}
