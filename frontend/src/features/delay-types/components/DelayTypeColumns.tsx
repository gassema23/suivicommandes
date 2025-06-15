import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { DelayType } from "@/shared/delay-types/types/delay-type.type";

momentFr();

type DelayTypeWithDelete = DelayType & { onDelete: () => void };

export const delayTypeColumns: ColumnDef<DelayTypeWithDelete>[] = [
  {
    accessorKey: "delayTypeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de délai" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Dernière modification",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      return moment(getValue<string>()).fromNow();
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <DataTableAction
          id={row.original.id}
          baseUrl="/pilotages/delay-types/update/$id"
          onDelete={row.original.onDelete}
          resource="delay_types"
        />
      );
    },
  },
];
