"use client";
import React from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { useElection } from "@/hooks/public-api-hooks/use-election-api";
import ValidateVoter from "./validate-voter";
import InvalidPrompt from "@/components/invalid-prompt";

type Props = {
    eventId: number;
};

const ElectionHome = ({ eventId }: Props) => {
    const { data: election, isLoading } = useElection({
        eventId,
        showErrorMessage: true,
    });

    if (isLoading) return <LoadingSpinner className="fixed top-1/2 left-1/2" />;

    if (!election)
        return <InvalidPrompt message="This event does not have an election" />;

    if (election.status === "done")
        return <InvalidPrompt message="This election has ended" />;

    if (election.status != "live")
        return <InvalidPrompt message="Election is not yet open" />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">
                {election.electionName}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <div className="py-8 lg:py-10">
                <ValidateVoter electionWithEvent={election} />
            </div>
        </div>
    );
};

export default ElectionHome;
