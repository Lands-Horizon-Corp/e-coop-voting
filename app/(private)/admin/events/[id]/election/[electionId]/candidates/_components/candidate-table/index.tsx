"use client";
import React, { useCallback, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import SearchInput from "@/components/data-table/table-search-input";
import { cn } from "@/lib/utils";
import columns from "./column";
import CreateCandidateModal from "../modals/create-candidate-modal";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import { TCandidatewithPositionwithEventId, TPosition } from "@/types";
import { toast } from "sonner";
import { FilteredEventMembersForCandidateSelection } from "@/hooks/api-hooks/member-api-hook";
import { Card } from "@/components/ui/card";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

type Props = {
    params: { id: number; electionId: number };
    data: TCandidatewithPositionwithEventId[];
    positions: TPosition[] | undefined;
};

const CandidateTable = ({ data, positions, params }: Props) => {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [createPosition, setCreatePosition] = useState(false);

    const { data: Members, refetch } =
        FilteredEventMembersForCandidateSelection(params.id, params.electionId);

    const handleEventHasSubChange = useCallback(() => refetch(), [refetch]);
    useOnEventSubDataUpdate({
        eventId: params.id,
        onChange: handleEventHasSubChange,
    });

    const table = useReactTable({
        data,
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
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="flex flex-1 flex-col gap-y-2 ">
            <Card className="flex flex-wrap items-center dark:bg-transparent border-0 justify-between p-3 rounded-xl gap-y-2 ">
                <CreateCandidateModal
                    positions={positions}
                    params={params}
                    data={Members}
                    state={createPosition}
                    onClose={(state) => setCreatePosition(state)}
                />
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative">
                        <SearchIcon className="absolute text-muted-forground  w-4 h-auto top-3 left-2" />
                        <SearchInput
                            setGlobalFilter={(e) => setGlobalFilter(e)}
                            globalFilter={globalFilter}
                        ></SearchInput>
                    </div>
                </div>
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <DataTableViewOptions table={table} />
                    <Button
                        onClick={() => {
                            if (positions?.length === 0) {
                                toast.warning(
                                    "You will not be able to add a candidate if the position is empty."
                                );
                                return;
                            }
                            setCreatePosition(true);
                        }}
                        size="sm"
                        className={cn(
                            "flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                        )}
                    >
                        Add Candidate
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
            <DataTable
                className="flex-1 bg-background/50 rounded-"
                table={table}
            />
            <div className="lg:hidden">
                <DataTableBasicPagination2 table={table} />
            </div>
            <div className="hidden lg:block">
                <DataTablePagination pageSizes={[5, 10, 15]} table={table} />
            </div>
        </div>
    );
};

export default CandidateTable;
