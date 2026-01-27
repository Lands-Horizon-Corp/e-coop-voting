import { $Enums, Election } from "@prisma/client";
import { TCandidate, TCandidatewithPosition, TEvent, TPosition, TPositionWithCandidatesAndPosition } from ".";

export type TCreateElection = {
    electionName: string;
    status: $Enums.ElectionStatus;
};

export type TElection = Election;

export type TElectionWithEvent = TElection & { event: TEvent };

export type TElectionWithPositionAndCandidate = TElection & { positions : TPosition[] } & {candidates: TCandidate[]}

export type TElectionWithPositionsAndCandidates = TElection & { event: TEvent } & { positions : TPositionWithCandidatesAndPosition[] } & {candidates: TCandidatewithPosition[]} 

// for public/events election usage
export type TElectionWithEventWithPositionAndCandidates = TElectionWithEvent & { positions : TPositionWithCandidatesAndPosition[] }
