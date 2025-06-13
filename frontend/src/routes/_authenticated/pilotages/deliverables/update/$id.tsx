import LoadingPage from '@/components/ui/loader/LoadingPage';
import FormError from '@/components/ui/shadcn/form-error';
import { QUERY_KEYS } from '@/constants/query-key.constant';
import { createPermissionGuard } from '@/shared/authorizations/helpers/createPermissionGuard';
import { PERMISSIONS } from '@/shared/authorizations/types/auth.types';
import DeliverableUpdateForm from '@/features/deliverables/components/DeliverableUpdateForm';
import { fetchDeliverable } from '@/features/deliverables/services/fetch-deliverable.service';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'

const deliverableQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.DELIVERABLE_WITH_ID(id),
    queryFn: () => fetchDeliverable(id),
  });

export const Route = createFileRoute(
  '/_authenticated/pilotages/deliverables/update/$id',
)({
   beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLES.UPDATE]),
    loader: ({ context, params }) =>
      context.queryClient.ensureQueryData(deliverableQueryOptions(params.id)),
    head: () => ({
      meta: [{ title: "Modifier le livrable" }],
    }),
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement du livrable"
        message={error.message}
      />
    ),
    staticData: {
      title: "Modifier le livrable",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        { label: "Livrables", href: "/pilotages/deliverables" },
        {
          label: "Modifier le livrable",
          href: "/pilotages/deliverables/update/$id",
          isCurrent: true,
        },
      ],
    },
  
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(deliverableQueryOptions(id!));
  return <DeliverableUpdateForm deliverable={data} />;
}