import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { ServiceColumns } from "@/features/services/components/ServiceColumns";
import { getServices } from "@/features/services/services/get-services.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ServiceResponse } from "@/features/services/types/service.type";
import { QUERY_KEYS } from "@/config/query-key";

const servicesQueryOptions = queryOptions<ServiceResponse>({
  queryKey: QUERY_KEYS.SERVICES,
  queryFn: () => getServices(),
});

export const Route = createFileRoute("/_authenticated/pilotages/services/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.READ]),
  head: () => ({
    meta: [{ title: "Services" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(servicesQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des services"
      message={error.message}
    />
  ),
  staticData: {
    title: "Services",
    action: "/pilotages/services/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Services", href: "/pilotages/services", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: services } =
    useSuspenseQuery<ServiceResponse>(servicesQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...services,
    data: (services.data ?? []).map((service) => ({
      ...service,
      onDelete: () => setDeleteId(service.id),
    })),
  };
  return (
    <>
      <DataTable data={dataWithDelete} columns={ServiceColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="services"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
        }}
      />
    </>
  );
}
