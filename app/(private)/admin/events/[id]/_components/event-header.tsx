"use client";
import { Badge } from "@/components/ui/badge";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  params: { id: number; electionId: number };
};

const ElectionStatus = ({ params }: Props) => {

  const { elections } = getElectionWithPositionAndCandidates({
    params,
  });

  if (!elections) return;

  const isLive = elections?.status === "live";
  const isPending = elections?.status === "pending";
  const isEnded = elections?.status === "done";

  return (
    <>
      {isLive && (
        <Badge
          className={cn(
            "dark:text-foreground !text-[11px] text-red-300 animate-pulse bg-red-600 border-red-800 dark:border-red-500 tracking-wide"
          )}
        >
          live
        </Badge>
      )}
      {isPending && (
        <Badge
          className={cn(
            "text-foreground bg-yellow-400 !text-[11px] dark:bg-yellow-500 text-yellow-900 border-yellow-600 tracking-wide"
          )}
        >
          pending
        </Badge>
      )}
      {isEnded && (
        <Badge
          className={cn(
            "text-foreground bg-green-400 !text-[11px] dark:bg-green-500 text-green-900 border-green-600 tracking-wide"
          )}
        >
          <div className="flex space-x-2">
            <p>ended</p>
            <CheckCircle2 className="size-4 text-gray-900"></CheckCircle2>
          </div>
        </Badge>
      )}
    </>
  );
};

const EventHeader = ({ params }: Props) => {
  const pathname = usePathname();
  const isCurrentPathElection = pathname.includes("election");
  return (
    <div>
      <h1 className="font-bold flex gap-x-2 text-[min(20px,3.5vw)]">
        Manage {" "}
        {isCurrentPathElection ? (
          <div className="flex gap-x-2 items-center">
            Election
            <ElectionStatus params={params} />
          </div>
        ) : (
          "Event"
        )}
      </h1>
    </div>
  );
};

export default EventHeader;
