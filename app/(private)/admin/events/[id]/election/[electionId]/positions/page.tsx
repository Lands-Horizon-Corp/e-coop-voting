"use client";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import Header from "../_components/header";
import PositionTable from "./_components/position-table";
import NotAllowed from "../../../_components/not-allowed";

import { isAllowed } from "@/lib/utils";
import { TPositionWithEventID } from "@/types";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

type Props = {
    params: { id: number; electionId: number };
};

const Page = ({ params }: Props) => {
    const { data: sessionData, status } = useSession();
    const [data, setData] = useState<TPositionWithEventID[]>([]);
    const { elections, isLoading, error, refetch } =
        getElectionWithPositionAndCandidates({
            params,
        });

    const handleEventHasSubChange = useCallback(() => refetch(), [refetch]);
    useOnEventSubDataUpdate({
        eventId: params.id,
        onChange: handleEventHasSubChange,
    });

    useEffect(() => {
        if (elections && elections.positions) {
            setData(
                elections.positions.map((position) => ({
                    ...position,
                    eventId: params.id,
                }))
            );
        }
    }, [elections, params.id]);

    if (status === "loading" || isLoading)
        return (
            <div className="w-full h-[400px] flex justify-center items-center space-x-2 text-primary">
                <Loader2 className=" size-5 animate-spin"></Loader2>
                <h1 className=" animate-pulse">Loading...</h1>
            </div>
        );

    if (!isAllowed(["root", "coop_root", "admin"], sessionData?.user))
        return <NotAllowed />;

    if (error) return;
    return (
        <div>
            <Header text="Manage Positions"></Header>
            <PositionTable
                params={params}
                electionId={params.electionId}
                data={data}
            ></PositionTable>
        </div>
    );
};

export default Page;
