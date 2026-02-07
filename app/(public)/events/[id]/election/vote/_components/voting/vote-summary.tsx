import { formatDateTime } from "@/lib/utils";
import CandidateCard from "./candidate-card";

import {
  TCandidatewithPosition,
  TEvent,
  TPositionWithCandidatesAndPosition,
} from "@/types";

type Props = {
  positions: TPositionWithCandidatesAndPosition[];
  votes: TCandidatewithPosition[];
  event: TEvent;
};

const VoteSummary = ({ positions, votes, event }: Props) => {
  return (
    <div className="w-full flex flex-col gap-y-8 items-center">
      {/* Event Details (important for download / screenshot) */}
      <div className="w-full max-w-3xl border rounded-lg p-4 lg:p-6 text-center space-y-1">
        <p className="text-lg lg:text-2xl font-semibold">{event.title}</p>

        <p className="text-sm text-foreground/70">
          {formatDateTime(event.date)}
        </p>

        <p className="text-sm text-foreground/70">{event.location}</p>
      </div>

      {/* Vote Summary Header */}
      <div className="flex flex-col gap-y-4 items-center">
        <p className="text-xl lg:text-3xl xl:text-4xl">Your Vote Summary</p>
        <p className="text-sm text-foreground/70 text-center">
          Please review your vote carefully & take a screenshot before casting
          your vote.
        </p>
      </div>

      {/* Positions */}
      <div className="w-full gap-y-4 lg:gap-y-16 min-h-[70vh] py-18 flex flex-col flex-1">
        {positions.map((position) => (
          <div
            key={position.id}
            className="w-full gap-y-1 lg:gap-y-2 flex flex-col items-center"
          >
            <p className="text-base font-medium lg:text-2xl">
              {position.positionName}
            </p>

            <div className="flex gap-y-1 lg:gap-y-4 flex-wrap w-full justify-center">
              {votes.filter((v) => v.position.id === position.id).length ===
                0 && (
                <p className="text-xs text-foreground/70">
                  No selected candidate for this position
                </p>
              )}

              {votes
                .filter((v) => v.position.id === position.id)
                .map((votedCandidate) => (
                  <CandidateCard
                    key={votedCandidate.id}
                    canSelect={false}
                    isChosen
                    candidate={votedCandidate}
                    onRemove={() => {}}
                    onSelect={() => {}}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteSummary;
