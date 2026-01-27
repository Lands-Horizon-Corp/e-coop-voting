"use client";
import React from "react";

import VoteWindow from "./voting/vote-window";
import LoadingSpinner from "@/components/loading-spinner";
import InvalidPrompt from "@/components/invalid-prompt";
import { useElectionWithEventAndPositionsAndCandidates } from "@/hooks/public-api-hooks/use-election-api";

type Props = {
  eventId: number;
};

const VoteHome = ({ eventId }: Props) => {
  const { election, isLoading } =
    useElectionWithEventAndPositionsAndCandidates(eventId);

  if (isLoading) return <LoadingSpinner className="fixed top-1/2 left-1/2" />;

  if (!election) return <InvalidPrompt message="Election doesn't exist" />;

  if (election.status !== "live")
    return <InvalidPrompt message="Election is not live" />;

  if (election.positions.length === 0)
    return (
      <InvalidPrompt message="It seems like this election doesn't have positions and candidates yet. Please contact admin" />
    );

  return (
    <div className="flex flex-col mt-2 pt-8 lg:pt-16 px-5 gap-y-1 lg:gap-y-6 min-h-screen w-full items-center  bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#e7e0fb] dark:from-secondary to-transparent">
      {/* <p className="text-lg lg:text-2xl pt-2 uppercase text-center">
                {election.electionName}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" /> */}
      <VoteWindow election={election} />
    </div>
  );
};

export default VoteHome;
