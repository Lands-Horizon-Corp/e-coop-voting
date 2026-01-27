
import { Candidate, Position, Votes } from "@prisma/client"

export type TCreateCandidate = {
    firstName:string,
    lastName:string,
    passbookNumber: string,
    picture: string | null;
    electionId: number;
    positionId: number;
}

export type TCandidate = Candidate

export type TCandidatewithVotes = TCandidate & {votes:Votes[]}

export type TCandidatewithPosition = Candidate & {position:Position} 

export type TVoteCopyB64 = { positionName : string, votedCandidates : TCandidatewithPosition[] }

export type TCandidatewithPositionwithEventId = Candidate & {position:Position} & {eventId:number}