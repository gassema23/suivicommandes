import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/common/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/common/table/components/DataTableColumnHeader";
import type { RequisitionType } from "../types/requisition-type.type";

momentFr();

export const requisitionTypeColumns: ColumnDef<RequisitionType>[] = [
  {
    accessorKey: "requisitionTypeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de réquisition" />
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
          baseUrl="/pilotages/requisition-types/update/$id"
          onDelete={row.original.onDelete}
          resource="requisition_types"
        />
      );
    },
  },
];
