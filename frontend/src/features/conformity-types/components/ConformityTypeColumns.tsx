import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { ConformityType } from "@/shared/conformity-types/types/conformity-type.type";

momentFr();

type ConformityTypeWithDelete = ConformityType & { onDelete: () => void };

export const conformityTypeColumns: ColumnDef<ConformityTypeWithDelete>[] = [
  {
    accessorKey: "conformityTypeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de conformité" />
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
          baseUrl="/pilotages/conformity-types/update/$id"
          onDelete={row.original.onDelete}
          resource="conformity_types"
        />
      );
    },
  },
];
