import LoadingPage from '@/components/ui/loader/LoadingPage';
import FormError from '@/components/ui/shadcn/form-error';
import { createPermissionGuard } from '@/shared/authorizations/helpers/createPermissionGuard';
import { PERMISSIONS } from '@/shared/authorizations/types/auth.types';
import { QUERY_KEYS } from '@/constants/query-key.constant';
import RequisitionTypeUpdateForm from '@/features/requisition-types/components/DelayTypeUpdateForm';
import { fetchRequisitionType } from '@/features/requisition-types/services/fetch-requisition-type.service';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'

const requisitionTypeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.REQUISITION_TYPE_WITH_ID(id),
    queryFn: () => fetchRequisitionType(id),
  });

export const Route = createFileRoute(
  '/_authenticated/pilotages/requisition-types/update/$id',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUISITION_TYPES.UPDATE]),
      loader: ({ context, params }) =>
        context.queryClient.ensureQueryData(requisitionTypeQueryOptions(params.id)),
      head: () => ({
        meta: [{ title: "Modifier le type de réquisition" }],
      }),
      errorComponent: ({ error }) => (
        <FormError
          title="Erreur lors du chargement du type de réquisition"
          message={error.message}
        />
      ),
      staticData: {
        title: "Modifier le type de réquisition",
        breadcrumb: [
          { label: "Tableau de bord", href: "/" },
          { label: "Types de réquisition", href: "/pilotages/requisition-types" },
          {
            label: "Modifier le type de réquisition",
            href: "/pilotages/requisition-types/update/$id",
            isCurrent: true,
          },
        ],
      },
    
      pendingComponent: () => <LoadingPage />,
      component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(requisitionTypeQueryOptions(id!));
  return <RequisitionTypeUpdateForm requisitionType={data} />;
}
