"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import VoteHeader from "./vote-header";
import VoteSummary from "./vote-summary";
import OnlyPortrait from "../only-portrait";
import CandidateList from "./candidate-list";
import OnlyLandscape from "../only-landscape";
import VoteNavControl from "./vote-nav-control";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useCastVote, loadVoter } from "@/hooks/public-api-hooks/use-vote-api";
import {
    TCandidatewithPosition,
    TElectionWithEventWithPositionAndCandidates,
    TVoteCopyB64,
} from "@/types";

type Props = {
    election: TElectionWithEventWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
    const router = useRouter();
    const { onOpen } = useConfirmModal();

    const [currentPage, setCurrentPage] = useState(0);
    const [votes, setVotes] = useState<TCandidatewithPosition[]>([]);

    const { isPending, isError, error } = loadVoter(election);
    const { data, castVote, isCasting } = useCastVote(election, (voter) => {
        try{
            let myVotes : TVoteCopyB64[] = []
        
            election.positions.forEach((pos)=>{
                const { positionName, id } = pos;
                const votedCandidates = votes.filter((votedCandidate) => votedCandidate.positionId === id )
                myVotes.push({ positionName, votedCandidates });
            })
    
            const voteB64 = btoa(JSON.stringify(myVotes))
            router.push(`/events/${election.eventId}/election/vote/complete?pb=${voter.passbookNumber}&fullname=${`${voter.firstName} ${voter.lastName}`}&picture=${voter.picture}&votes=${voteB64}`);
        }catch(e){
            router.push(`/events/${election.eventId}/election/vote/complete?pb=${voter.passbookNumber}&fullname=${`${voter.firstName} ${voter.lastName}`}&picture=${voter.picture}`);
        }
    });

    if (isPending)
        return (
            <div className="fixed top-1/2 left-auto gap-x-2 rounded-xl flex items-center justify-center px-3 py-1 bg-secondary/40 backdrop-blur-sm">
                <LoadingSpinner strokeWidth={1} />
                <p className="text-foreground/80 text-sm">checking authorization</p>
            </div>
        );

    if (isError && error)
        return <InvalidPrompt className="text-lg" message={error} />;

    const totalPositions = election.positions.length - 1;
    const currentPosition =
        election.positions[
        currentPage > totalPositions - 1 ? totalPositions : currentPage
        ];
    const canNext = () => {
        const currentPositionChosenLength = votes.filter(
            (votedCandidate) => votedCandidate.position.id === currentPosition.id,
        ).length;
        if (election.voteConfiguration === "ATLEAST_ONE")
            return currentPositionChosenLength >= 1;
        if (election.voteConfiguration === "REQUIRE_ALL")
            return currentPositionChosenLength === currentPosition.numberOfSelection;
        return true;
    };

    return (
        <div className="w-full max-w-7xl py-2 lg:py-16 pb-4">
            <div className="w-full flex flex-col min-h-[70vh]">
                {currentPage > totalPositions ? (
                    <VoteSummary positions={election.positions} votes={votes} />
                ) : (
                    <>
                        <VoteHeader
                            voteConfig={election.voteConfiguration}
                            position={currentPosition}
                            selected={
                                votes.filter(
                                    (votedCandidate) =>
                                        votedCandidate.position.id === currentPosition.id,
                                ).length
                            }
                        />
                        <CandidateList
                            maxSelect={currentPosition.numberOfSelection}
                            chosenCandidates={votes.filter(
                                (votedCandidate) =>
                                    votedCandidate.position.id === currentPosition.id,
                            )}
                            onAdd={(candidate) => {
                                setVotes((prevVotes) => [...prevVotes, candidate]);
                            }}
                            onRemove={(candidate) => {
                                setVotes((prevVotes) =>
                                    prevVotes.filter((voted) => voted.id !== candidate.id),
                                );
                            }}
                            candidates={currentPosition.candidates}
                        />
                    </>
                )}
            </div>
            <VoteNavControl
                casted={data !== undefined}
                currentPage={currentPage}
                lastPage={totalPositions}
                isLoading={isCasting}
                onBack={() => setCurrentPage((prev) => prev - 1)}
                onNext={() => setCurrentPage((prev) => prev + 1)}
                onFinalize={() =>
                    onOpen({
                        title: "Cast Vote",
                        description:
                            "We suggest that you review your vote first before submitting. If you believe that your selection is correct, you can now proceed on casting your vote.",
                        confirmString: "Cast Vote",
                        cancelString: "Review Vote",
                        onConfirm: () =>
                            castVote(votes.map((votedCandidate) => votedCandidate.id)),
                    })
                }
                canFinalize={votes.length > 0}
                canNext={canNext()}
            />
            {election.voteScreenConfiguration === "LANDSCAPE" && <OnlyLandscape />}
            {election.voteScreenConfiguration === "PORTRAIT" && <OnlyPortrait />}
        </div>
    );
};

export default VoteWindow;
