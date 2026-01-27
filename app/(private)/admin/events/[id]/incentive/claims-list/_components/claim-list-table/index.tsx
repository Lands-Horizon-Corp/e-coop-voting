"use client";
import { user } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Check,
    HandHeart,
    Hourglass,
    MonitorSmartphone,
    SearchIcon,
    User,
} from "lucide-react";

import columns from "./column";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import {
    DataTableFacetedFilter,
    FacetedOptionType,
} from "@/components/data-table/data-table-facited-filter";

import { eventBasedUserList } from "@/hooks/api-hooks/user-api-hooks";
import { useClaimsMasterList } from "@/hooks/api-hooks/incentive-api-hooks";
import LoadingSpinner from "@/components/loading-spinner";
import { GrRotateRight } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

const claimFromFilter: FacetedOptionType[] = [
    {
        label: "Assisted",
        value: "Assisted",
        icon: HandHeart,
    },
    {
        label: "Online",
        value: "Online",
        icon: MonitorSmartphone,
    },
];

const claimStatusFilter: FacetedOptionType[] = [
    {
        label: "Released",
        value: "Released",
        icon: Check,
    },
    {
        label: "Pending Release",
        value: "Pending",
        icon: Hourglass,
    },
];

type Props = { eventId: number; currentUser: user };

const ClaimListTable = ({ eventId, currentUser }: Props) => {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);
    const { data: users } = eventBasedUserList(eventId);
    const { data } = useSession();

    const myFilter = [
        {
            label: "You",
            value: currentUser.id.toString(),
            icon: User,
        },
    ];

    const {
        data: claimList,
        refetch,
        isFetching,
        isError,
        isLoading,
    } = useClaimsMasterList({ eventId });

    const handleEventHasSubChange = useCallback(() => refetch(), [refetch]);
    useOnEventSubDataUpdate({ eventId, onChange: handleEventHasSubChange });

    const table = useReactTable({
        data: claimList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        initialState: {
            pagination: { pageIndex: 0, pageSize: 20 },
            columnVisibility: { "Claim Id": false },
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "k") ||
                (event.altKey && event.key === "k") ||
                (event.metaKey && event.key === "k")
            ) {
                event.preventDefault();
                onFocusSearch.current?.focus();
            }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
            window.removeEventListener("keydown", shortCutCommand);
        };
    }, []);

    return (
        <div className="flex flex-1 flex-col  gap-y-5 ">
            <div className="flex flex-wrap items-center p-2 justify-between rounded-t-xl gap-y-2 rounded border-b bg-background dark:border dark:bg-secondary/70 ">
                <div className="flex flex-1 items-center gap-x-2 gap-y-1  overflow-hidden flex-wrap text-muted-foreground">
                    <div className="w-full lg:w-fit relative">
                        <SearchIcon className="absolute w-4 h-auto top-3 text-muted-foreground left-2" />
                        <Input
                            ref={onFocusSearch}
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="w-full pl-8 bg-popover text-muted-foreground placeholder:text-muted-foreground placeholder:text-[min(14px,3vw)] text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="flex items-center w-full overflow-x-scroll lg:overflow-visible thin-scroll flex-1 gap-x-2 justify-center md:justify-between">
                        {data && data.user.role !== "staff" ? (
                            <div className="flex items-center gap-x-2">
                                <DataTableFacetedFilter
                                    title="Claim Mode"
                                    options={claimFromFilter}
                                    column={table.getColumn("Claim Mode")}
                                />
                                <DataTableFacetedFilter
                                    options={[
                                        ...myFilter,
                                        ...users
                                            .filter(
                                                (user) =>
                                                    user.id !== data.user.id
                                            )
                                            .map((user) => ({
                                                label: user.name,
                                                value: user.id.toString(),
                                                icon: User,
                                            })),
                                    ]}
                                    column={table.getColumn("Assisted By")}
                                    title="Assisted by"
                                />
                                <DataTableFacetedFilter
                                    title="Status"
                                    options={claimStatusFilter}
                                    column={table.getColumn("Status")}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-2">
                                <DataTableFacetedFilter
                                    title="Status"
                                    options={claimStatusFilter}
                                    column={table.getColumn("Status")}
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-x-1">
                            <DataTableViewOptions table={table} />
                            <Button
                                variant={"secondary"}
                                disabled={isFetching}
                                onClick={() => refetch()}
                                className="gap-x-2"
                                size="icon"
                            >
                                {isFetching ? (
                                    <LoadingSpinner />
                                ) : (
                                    <GrRotateRight className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                className="flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
                isError={isError}
                isLoading={isLoading || isFetching}
                table={table}
            />
            <DataTablePagination
                pageSizes={[20, 40, 60, 80, 100]}
                table={table}
            />
        </div>
    );
};

export default ClaimListTable;
