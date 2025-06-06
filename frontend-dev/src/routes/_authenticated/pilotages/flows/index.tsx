import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { DataTable } from "@/features/common/table/DataTable";
import { flowColumns } from "@/features/flows/components/FlowColumns";
import { getFlows } from "@/features/flows/services/get-flows.service";
import type { FlowResponse } from "@/features/flows/types/flow.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";

const flowsQueryOptions = (pageNumber: number) =>
  queryOptions<FlowResponse>({
    queryKey: QUERY_KEYS.FLOWS_WITH_PAGE(pageNumber),
    queryFn: () => getFlows(pageNumber),
  });

export const Route = createFileRoute('/_authenticated/pilotages/flows/')({
  beforeLoad: createPermissionGuard([PERMISSIONS.FLOWS.READ]),
    head: () => ({
      meta: [{ title: "Flux de transmissions" }],
    }),
    validateSearch: (search) => ({
      page: Number(search.page ?? 1),
    }),
    loader: (args) => {
      const { context, search } = args as any;
      return context.queryClient.ensureQueryData(
        flowsQueryOptions(Number(search?.page ?? "1"))
      );
    },
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement des flux de transmissions"
        message={error.message}
      />
    ),
    staticData: {
      title: "Flux de transmissions",
      action: "/pilotages/flows/create",
      breadcrumb: [
        { label: "Tableau de bord", href: "/" },
        {
          label: "Flux de transmissions",
          href: "/pilotages/flows",
          isCurrent: true,
        },
      ],
    },
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
  }
);

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: flows } = useSuspenseQuery<FlowResponse>(
    flowsQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...flows,
    data: (flows.data ?? []).map((flow) => ({
      ...flow,
      onDelete: () => setDeleteId(flow.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={flowColumns}
        currentPage={pageNumber}
        totalPages={flows.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="flows"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Flux de transmission"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.FLOWS,
          });
        }}
      />
    </>
  );
}