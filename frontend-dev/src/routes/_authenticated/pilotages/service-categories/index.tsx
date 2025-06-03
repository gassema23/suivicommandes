import LoadingPage from '@/components/ui/loader/LoadingPage';
import { DeleteModal } from '@/components/ui/quebec/DeleteModal';
import FormError from '@/components/ui/shadcn/form-error';
import { APP_NAME } from '@/config';
import { createPermissionGuard } from '@/features/authorizations/helpers/createPermissionGuard';
import { PERMISSIONS } from '@/features/authorizations/types/auth.types';
import { ServiceCategoryColumns } from '@/features/service-categories/components/ServiceCategoryColumns';
import { getServiceCategories } from '@/features/service-categories/services/get-service-categories.service';
import { DataTable } from '@/features/table/DataTable';
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

const serviceCategoriesQueryOptions = queryOptions({
  queryKey: ["serviceCategories"],
  queryFn: () => getServiceCategories(),
});

export const Route = createFileRoute(
  '/_authenticated/pilotages/service-categories/',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICE_CATEGORIES.READ]),
    head: () => ({
      meta: [{ title: `Catégories de services | ${APP_NAME}` }],
    }),
    loader: ({ context }) =>
      context.queryClient.ensureQueryData(serviceCategoriesQueryOptions),
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement des catégories de services"
        message={error.message}
      />
    ),
    staticData: {
      title: "Catégories de services",
      action: "/pilotages/service-categories/create",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        { label: "Catégories de services", href: "/pilotages/service-categories", isCurrent: true },
      ],
    },
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(serviceCategoriesQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...data,
    data: data.data.map((serviceCategory) => ({
      ...serviceCategory,
      onDelete: () => setDeleteId(serviceCategory.id),
    })),
  };
  return (
    <>
      <DataTable data={dataWithDelete} columns={ServiceCategoryColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="service-categories"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
        }}
      />
    </>
  );
}
