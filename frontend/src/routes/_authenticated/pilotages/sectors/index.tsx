import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { SectorColumns } from "@/features/sectors/components/SectorColumns";
import { DataTable } from "@/components/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { getSectors } from "@/features/sectors/services/get-sectors.service";
import type { SectorsResponse } from "@/shared/sectors/types/sector.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { createFileRoute } from "@tanstack/react-router";
import FormError from "@/components/ui/shadcn/form-error";
import LoadingPage from "@/components/ui/loader/LoadingPage";
import LoadingTable from "@/components/ui/loader/LoadingTable";

const sectorsQueryOptions = (pageNumber: number) =>
  queryOptions<SectorsResponse>({
    queryKey: QUERY_KEYS.SECTORS_WITH_PAGE(pageNumber),
    queryFn: () => getSectors(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/sectors/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICE_CATEGORIES.READ]),
  head: () => ({
    meta: [{ title: "Secteurs" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Secteurs",
    action: "/pilotages/sectors/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Secteurs",
        href: "/pilotages/sectors",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: sectors } = useSuspenseQuery<SectorsResponse>(
    sectorsQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...sectors,
    data: (sectors.data ?? []).map((sector) => ({
      ...sector,
      onDelete: () => setDeleteId(sector.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={SectorColumns}
        currentPage={pageNumber}
        totalPages={sectors.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deletePageName="sectors"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Secteur"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTORS });
        }}
      />
    </>
  );
}
