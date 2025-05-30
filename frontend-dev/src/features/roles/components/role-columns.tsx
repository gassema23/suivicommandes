import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/table/components/DataTableColumnHeader";
import type { Role } from "../types/role.type";

momentFr();

export const roleColumns: ColumnDef<Role>[] = [
  
  {
    accessorKey: "roleName",
     header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Date de modification",
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
    cell: ({ getValue }) => {
      return <DataTableAction id={getValue<string>()} />;
    },
  },
];
