import { Position } from "@prisma/client";
import { TCandidate, TCandidatewithPosition } from ".";

export type TCreatePosition = {
     positionName:string,
     numberOfSelection:number,
     electionId:number,
}

export type TUpdatePosition = {
     positionName:string,
     numberOfSelection:number,
     electionId:number,
}

export type TPosition = Position

export type TPositionWithEventID = Position & {eventId:number}

export type TPositionWithCandidates= Position & { candidates : TCandidate[] }

type Voters = {
     id:string,
     votersName:string,
     value?:number
}
type candidateVotersTally = {
     candidateName:string,
     passbookNumber:string,
     voters:Voters[]
     total:number
}
export type  BarGraphDataTypes = {
     positionName:string,
     dataSets: number[];
     bargraphNumerics: string[],
     piegraphNumerics:string[],
     voters:Voters[]
     candidateVotersTally:candidateVotersTally[]
     totalVotesForCandidate:number[]

}

// used in public event/[]/election/vote
export type TPositionWithCandidatesAndPosition = Position & { candidates : TCandidatewithPosition[] }
