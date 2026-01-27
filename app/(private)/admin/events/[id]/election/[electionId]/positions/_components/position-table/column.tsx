"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import {
   Trash2Icon,
} from "lucide-react";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useState } from "react";
import {  TPositionWithEventID } from "@/types";
import { deletePosition } from "@/hooks/api-hooks/position-api-hooks";
import UpdatePositionModal from "../modals/update-position-modal";

const columns: ColumnDef<TPositionWithEventID>[] = [
   {
      accessorKey: "id",
      header: ({ column }) => <DataTableColHeader column={column} title="id" />,
      cell: ({ row }) => (
         <div className="font-medium uppercase">{row.original.id}</div>
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "positionName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="Position Name" />
      ),
      cell: ({ row }) => {
         return <div className=""> {row.original.positionName}</div>;
      },
   },
   {
      accessorKey: "numberOfSelection",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="number of Seats" />
      ),
      cell: ({ row }) => (
         <div className=""> {row.original.numberOfSelection}
         </div>
      ),
   },
   {
      id: "edit",
      cell: ({ row }) => {
         const [onOpenModal, setOnOpenModal] = useState(false);
         return (
            <>
               <UpdatePositionModal
                  position={row.original}
                  state={onOpenModal}
                  onClose={() => setOnOpenModal(false)}
               ></UpdatePositionModal>
               <Button
                  onClick={() => {
                     setOnOpenModal(true);
                  }}
                  variant={"outline"}
               >
                  edit
               </Button>
            </>
         );
      },
   },
   {
      id: "delete",
      cell: ({ row }) => {
         const params = {id:row.original.eventId,electionId:row.original.electionId}
         const deleteOperation = deletePosition(params);
         const { onOpen: onOpenConfirmModal } = useConfirmModal();
         return (
            <>
               <Trash2Icon
                  onClick={() => {
                     onOpenConfirmModal({
                        title: "Delete Position 🗑️",
                        description:
                           "Are you sure to delete this position permanently? This cannot be undone.",
                        onConfirm: () => {
                           deleteOperation.mutate(row.original.id);
                        },
                     })
                  }}
                  className="size-5 text-red-600 hover:scale-105 cursor-pointer"
               />
            </>
         );
      },
   },
];

export default columns;
