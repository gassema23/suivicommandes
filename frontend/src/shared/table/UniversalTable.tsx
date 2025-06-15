import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";

export interface UniversalTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pagination: PaginationState;
  paginationOptions: {
    onPaginationChange: (pagination: PaginationState) => void;
    rowCount?: number;
  };
  sorting: SortingState;
  onSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  isLoading?: boolean;
}

export function UniversalTable<TData>({
  data,
  columns,
  pagination,
  paginationOptions,
  sorting,
  onSortingChange,
  filters,
  onFilterChange,
  isLoading,
}: UniversalTableProps<TData>) {
  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    pageCount: paginationOptions.rowCount
      ? Math.ceil((paginationOptions.rowCount ?? 0) / pagination.pageSize)
      : undefined,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: paginationOptions.onPaginationChange,
    onSortingChange,
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <table className="min-w-full border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-2 py-1 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? (
                    header.column.getIsSorted() === "asc" ? " 🔼" : " 🔽"
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}