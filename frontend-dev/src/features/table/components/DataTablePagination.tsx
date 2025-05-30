import { Pagination } from "@/components/ui/quebec/Pagination";

interface DataTablePaginationProps<TData> {
  table: import("@tanstack/react-table").Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center justify-between px-2">
      <Pagination
        currentPage={pageIndex + 1}
        totalPages={pageCount}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
  );
}
