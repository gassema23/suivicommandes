import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/common/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/common/table/components/DataTableColumnHeader";
import type { Sector } from "../types/sector.type";
import { CheckCircle, XCircle } from "lucide-react";

momentFr();

export const SectorColumns: ColumnDef<Sector>[] = [
  {
    accessorKey: "sectorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secteur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "sectorClientTimeEnd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Heure de tombée (client)" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "sectorProviderTimeEnd",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Heure de tombée (fournisseur)"
      />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "isAutoCalculate",
    cell: ({ getValue }) => {
      return getValue<boolean>() ? <CheckCircle className="text-success ml-5" /> : <XCircle className="text-destructive ml-5" />;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Calcul automatique" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "isConformity",
    cell: ({ getValue }) => {
      return getValue<boolean>() ? <CheckCircle className="text-success ml-5" /> : <XCircle className="text-destructive ml-5" />;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conformité obligatoire" />
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
          baseUrl="/pilotages/sectors/update/$id"
          onDelete={row.original.onDelete}
          resource="sectors"
        />
      );
    },
  },
];
