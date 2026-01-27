"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { HandHeartIcon, TabletSmartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import LoadingSpinner from "@/components/loading-spinner";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import {
    useClaimDelete,
    useClaimRelease,
} from "@/hooks/api-hooks/incentive-api-hooks";
import { TIncentiveClaimsWithIncentiveAttendeeAssistedBy } from "@/types";

const Actions = ({
    incentive,
}: {
    incentive: TIncentiveClaimsWithIncentiveAttendeeAssistedBy;
}) => {
    const { onOpen } = useConfirmModal();

    const { deleteClaim, isDeletingClaim } = useClaimDelete(incentive.eventId);

    if (isDeletingClaim)
        return (
            <LoadingSpinner className="h-4 text-foreground/70 animate-spin" />
        );

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() =>
                onOpen({
                    title: "Delete Claim Entry",
                    description:
                        "Are you sure to delete this entry? If you accidentally claim something, or the item was returned, you can delete it here.",
                    onConfirm: () => deleteClaim(incentive.id),
                })
            }
        >
            Delete
        </Button>
    );
};

const ReleaseAction = ({
    incentiveClaim,
}: {
    incentiveClaim: TIncentiveClaimsWithIncentiveAttendeeAssistedBy;
}) => {
    const { onOpen } = useConfirmModal();
    const { releaseClaim, isReleasing } = useClaimRelease(
        incentiveClaim.eventId,
        incentiveClaim.id
    );

    return (
        <Button
            size="sm"
            variant="outline"
            className="rounded-2xl flex gap-x-2 items-center"
            onClick={() =>
                onOpen({
                    title: "Release Claim",
                    description:
                        "Incentives that are claimed online by the user without staff assistance should be claim from the staff/admin assigned. By releasing this claim, you are confirming that you have given this item to the member. This will also count in your assisted claim.",
                    onConfirm: () =>
                        releaseClaim({
                            incentiveItemId: incentiveClaim.incentive.id,
                        }),
                    confirmString: "Release",
                })
            }
        >
            {isReleasing && <LoadingSpinner />}
            <span className="text-orange-400">Pending Release</span>
        </Button>
    );
};

const columns: ColumnDef<TIncentiveClaimsWithIncentiveAttendeeAssistedBy>[] = [
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColHeader
                className="text-left "
                column={column}
                title="Actions"
            />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start ">
                <Actions incentive={row.original} />
            </div>
        ),
    },
    {
        id: "Status",
        accessorKey: "released",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">
                {row.original.releasedAt ? (
                    <p className="text-primary">Released</p>
                ) : (
                    <ReleaseAction incentiveClaim={row.original} />
                )}
            </div>
        ),
        filterFn: (row, id, value) => {
            const status = row.original.releasedAt ? "Released" : "Pending";
            return value.includes(status)
        },

        enableSorting: false,
    },
    {
        id: "Claim Id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claim ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
    },
    {
        accessorKey: "incentive.itemName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Item Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.incentive.itemName}
            </div>
        ),
    },
    {
        id: "Passbook Number",
        accessorKey: "eventAttendee.passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Passbook Number" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.passbookNumber}
            </div>
        ),
    },
    {
        id: "First Name",
        accessorKey: "eventAttendee.firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="First Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.firstName}
            </div>
        ),
    },
    {
        id: "Last Name",
        accessorKey: "eventAttendee.lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.lastName}
            </div>
        ),
    },
    {
        id: "Assisted By",
        accessorKey: "assistedBy.name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assisted By" />
        ),
        cell: ({ row }) => (
            <div className="flex ">
                {row.original.assistedBy ? (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-secondary text-[#457f5a] dark:text-[#68ca93]">
                        <UserAvatar
                            className="size-4"
                            src={row.original.assistedBy.picture as ""}
                            fallback={row.original.assistedBy.name.substring(
                                0,
                                2
                            )}
                        />
                        {row.original.assistedBy.name}
                    </div>
                ) : (
                    <p>-</p>
                )}
            </div>
        ),
        filterFn: (row, id, value) => {
            if (row.original.assistedBy === null) return false;
            return value.includes(row.original.assistedBy.id.toString());
        },
    },
    {
        id: "Claim Mode",
        accessorKey: "claimedOnline",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claimed Mode" />
        ),
        cell: ({ row }) => (
            <div>
                {row.original.claimedOnline ? (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-[#f0fdf5] dark:bg-[#f0fdf5]/5 text-[#457f5a] dark:text-[#68ca93]">
                        <TabletSmartphone className="size-3" />{" "}
                        <span>Claimed Online</span>
                    </div>
                ) : (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-[#f0fdf5] dark:bg-[#f0fdf5]/5 text-[#457f5a] dark:text-[#68ca93]">
                        <HandHeartIcon className="size-3" />{" "}
                        <span>Staff Assistance</span>
                    </div>
                )}
            </div>
        ),
        filterFn: (row, id, value) => {
            if (value.includes("Assisted")) return !row.original.claimedOnline;
            if (value.includes("Online")) return row.original.claimedOnline;
            return false;
        },
    },
    {
        id: "Claim Date",
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claimed Date" />
        ),
        cell: ({ row }) => (
            <div>{format(row.original.createdAt, "MMM dd yyyy hh:mm a")}</div>
        ),
    },
    {
        id: "Released Date",
        accessorKey: "releasedAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Released Date" />
        ),
        cell: ({ row }) => (
            <div>
                {row.original.releasedAt
                    ? format(row.original.releasedAt, "MMM dd yyyy hh:mm a")
                    : "-"}
            </div>
        ),
    },
];

export default columns;
