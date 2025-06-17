import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
import { deliverableColumns } from "@/features/deliverables/components/DeliverableColumns";
import { getDeliverables } from "@/features/deliverables/services/get-deliverables.service";
import type { DeliverableResponse } from "@/features/deliverables/types/deliverable.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import LoadingTable from "@/components/ui/loader/LoadingTable";

const deliverablesQueryOptions = (pageNumber: number) =>
  queryOptions<DeliverableResponse>({
    queryKey: QUERY_KEYS.DELIVERABLES_WITH_PAGE(pageNumber),
    queryFn: () => getDeliverables(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/deliverables/")(
  {
    beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLES.READ]),
    head: () => ({
      meta: [{ title: "Livrables" }],
    }),
    validateSearch: (search) => ({
      page: Number(search.page ?? 1),
    }),
    errorComponent: ({ error }) => <FormError message={error.message} />,
    staticData: {
      title: "Livrables",
      action: "/pilotages/deliverables/create",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        {
          label: "Livrables",
          href: "/pilotages/deliverables",
          isCurrent: true,
        },
      ],
    },
    pendingComponent: () => <LoadingTable rows={10} columns={4} />,
    component: RouteComponent,
  }
);

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: deliverables } = useSuspenseQuery<DeliverableResponse>(
    deliverablesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...deliverables,
    data: (deliverables.data ?? []).map((deliverable) => ({
      ...deliverable,
      onDelete: () => setDeleteId(deliverable.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={deliverableColumns}
        currentPage={pageNumber}
        totalPages={deliverables.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="deliverables"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Livrable"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.DELIVERABLES,
          });
        }}
      />
    </>
  );
}
