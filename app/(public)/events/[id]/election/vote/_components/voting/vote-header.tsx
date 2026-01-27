import { cn } from "@/lib/utils";
import { TPosition } from "@/types";
import { VotingConfiguration } from "@prisma/client";

type Props = {
    voteConfig: VotingConfiguration;
    position: TPosition;
    selected: number;
};

const VoteHeader = ({ position, voteConfig, selected }: Props) => {
    const { positionName, numberOfSelection } = position;

    return (
        <div className="flex justify-between w-full px-8 lg:px-0 items-center">
            <div className="space-y-1 lg:space-y-2">
                <p className="text-lg font-medium lg:text-4xl">{positionName}</p>
                <p className="text-xs lg:text-lg text-foreground/70">
                    {numberOfSelection} Seat(s) allowed for this position
                </p>
            </div>
            <div className="flex flex-col items-end gap-y-1">
                <p
                    className={cn(
                        "text-orange-400 text-sm lg:text-xl",
                        selected === numberOfSelection && "text-green-500",
                    )}
                >
                    {numberOfSelection - selected} Selection left
                </p>
                <p className="text-sm text-foreground/50">
                    { voteConfig === "REQUIRE_ALL" && `You must select ${numberOfSelection} candidate${numberOfSelection > 1 ? 's' : ''}` }
                    { voteConfig === "ATLEAST_ONE" && "You must select at least 1 candidate" }
                    { voteConfig === "ALLOW_SKIP" && "You can skip select" }
                </p> 
            </div>
        </div>
    );
};

export default VoteHeader;
