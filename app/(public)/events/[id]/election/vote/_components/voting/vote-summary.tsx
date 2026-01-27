import CandidateCard from "./candidate-card";

import {
  TCandidatewithPosition,
  TPositionWithCandidatesAndPosition,
} from "@/types";

type Props = {
  positions: TPositionWithCandidatesAndPosition[];
  votes: TCandidatewithPosition[];
};

const VoteSummary = ({ positions, votes }: Props) => {
  return (
    <div className="w-full flex flex-col gap-y-8 items-center">
      <div className="flex flex-col gap-y-4 items-center">
        <p className="text-xl lg:text-3xl xl:text-4xl">Your Vote Summary</p>
        <p className="text-sm text-foreground/70">
          Please review your vote carefuly & take a screenshot before casting vote.
        </p>
      </div>
      <div className="w-full gap-y-4 lg:gap-y-16 min-h-[70vh] py-18 flex flex-col flex-1 ">
        {positions.map((position) => (
          <div
            key={position.id}
            className="w-full gap-y-1 lg:gap-y-2 flex flex-col items-center"
          >
            <p className="text-base font-medium lg:text-2xl">
              {position.positionName}
            </p>
            <div className="flex gap-y-1 lg:gap-y-4 flex-wrap w-full justify-center">
              {votes.filter(
                (votedCandidate) => votedCandidate.position.id === position.id,
              ).length === 0 && (
                <p className="text-xs text-foreground/70">
                  No selected candidate for this position
                </p>
              )}
              {votes
                .filter(
                  (votedCandidate) =>
                    votedCandidate.position.id === position.id,
                )
                .map((votedCandidate) => (
                  <CandidateCard
                    key={votedCandidate.id}
                    canSelect={false}
                    isChosen={true}
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
