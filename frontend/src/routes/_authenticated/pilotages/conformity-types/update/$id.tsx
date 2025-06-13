import LoadingPage from '@/components/ui/loader/LoadingPage';
import FormError from '@/components/ui/shadcn/form-error';
import { QUERY_KEYS } from '@/constants/query-key.constant';
import { createPermissionGuard } from '@/shared/authorizations/helpers/createPermissionGuard';
import { PERMISSIONS } from '@/shared/authorizations/types/auth.types';
import ConformityTypeUpdateForm from '@/features/conformity-types/components/ConformityTypeUpdateForm';
import { fetchConformityType } from '@/features/conformity-types/services/fetch-conformity-type.service';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'

const conformityTypeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.CONFORMITY_TYPE_WITH_ID(id),
    queryFn: () => fetchConformityType(id),
  });

export const Route = createFileRoute(
  '/_authenticated/pilotages/conformity-types/update/$id',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CONFORMITY_TYPES.UPDATE]),
    loader: ({ context, params }) =>
      context.queryClient.ensureQueryData(conformityTypeQueryOptions(params.id)),
    head: () => ({
      meta: [{ title: "Modifier le type de conformité" }],
    }),
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement du type de conformité"
        message={error.message}
      />
    ),
    staticData: {
      title: "Modifier le type de conformité",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        { label: "Types de conformité", href: "/pilotages/conformity-types" },
        {
          label: "Modifier le type de conformité",
          href: "/pilotages/conformity-types/update/$id",
          isCurrent: true,
        },
      ],
    },
  
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(conformityTypeQueryOptions(id!));
  return <ConformityTypeUpdateForm conformityType={data} />;
}
