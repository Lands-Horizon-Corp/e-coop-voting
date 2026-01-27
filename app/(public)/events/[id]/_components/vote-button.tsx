import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { TEventWithElection } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  event: TEventWithElection;
};

const VoteButton = ({ event }: Props) => {
  if (event.category !== "election") return;

  if (!event || !event.election) return;

  const { election } = event;

  const canVote = election.status == "live";

  return (
    <Link
      href={canVote ? `/events/${event.id}/election/` : ""}
      className={cn("w-full", !canVote && "pointer-events-none")}
    >
      <Button
        disabled={!canVote}
        className={cn(
          "bg-[#00C667] w-full text-xl",
          !canVote &&
            "bg-secondary hover:bg-secondary text-secondary-foreground hover:text-secondary-foreground",
        )}
      >
        Vote
      </Button>
    </Link>
  );
};

export default VoteButton;
