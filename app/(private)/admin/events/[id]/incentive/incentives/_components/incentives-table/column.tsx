"use client";
import { toast } from "sonner";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon, MoreHorizontal, Pencil, Trash, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import UpdateIncentiveModal from "../modals/update-incentive-modal";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { TIncentiveWithClaimAndAssignedCount } from "@/types";
import { useDeleteIncentive } from "@/hooks/api-hooks/incentive-api-hooks";
import AssignModal from "../modals/assign-modal";

const Actions = ({ incentive }: { incentive: TIncentiveWithClaimAndAssignedCount; }) => {
    const [modal, setModal] = useState(false);
    const [assign, setAssign] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const { deleteIncentive, isPending } = useDeleteIncentive(
        incentive.eventId,
        incentive.id
    );

    if (isPending)
        return (
            <LoadingSpinner className="h-4 text-foreground/70 animate-spin" />
        );

    return (
        <>
            <UpdateIncentiveModal
                state={modal}
                onClose={() => setModal(false)}
                incentive={incentive}
            />
            <AssignModal state={assign} eventId={incentive.eventId} incentive={incentive} onClose={(state) => setAssign(state)} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="size-7 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="border-none shadow-2"
                    align="end"
                >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => {
                            navigator.clipboard.writeText(`${incentive.id}`);
                            toast.success("coppied");
                        }}
                    >
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Incentive ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setModal(true)}
                        className="px-2 gap-x-2"
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit
                        Incentive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setAssign(true)}
                        className="px-2 gap-x-2"
                    >
                        <UserPlus strokeWidth={2} className="h-4" /> Assign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Incentive 🗑️",
                                description:
                                    "Are you sure to delete this incentive?",
                                onConfirm: () => {
                                    deleteIncentive();
                                },
                            })
                        }
                        className="px-2 gap-x-2 text-destructive"
                    >
                        <Trash strokeWidth={2} className="h-4" /> Delete
                        Incentive
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TIncentiveWithClaimAndAssignedCount>[] = [
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColHeader
                className="text-left  max-w-4"
                column={column}
                title="Actions"
            />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start max-w-4">
                <Actions incentive={row.original} />
            </div>
        ),
    },
    {
        id : "Id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
    },
    {
        accessorKey: "itemName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Item Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.itemName}
            </div>
        ),
    },
    {
        accessorKey: "claimRequirement",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claim Requirement" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.claimRequirement}
            </div>
        ),
    },
    {
        accessorKey: "allotted",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assigned Staff" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original._count.assigned}</div>
        ),
    },
    {
        id : "Total Claimed",
        accessorKey: "_count.claimed",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Total Claimed" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original._count.claimed}</div>
        ),
    }
];

export default columns;
