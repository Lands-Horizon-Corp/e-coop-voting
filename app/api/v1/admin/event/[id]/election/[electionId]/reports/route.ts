import { routeErrorHandler } from "@/errors/route-error-handler";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { validateId } from "@/lib/server-utils";
import { TReportCandidate } from "@/types";
import { Prisma } from "@prisma/client";

type CandidateWithVotesAndPosition = Prisma.CandidateGetPayload<{
  include: { votes: true; position: true };
}>;

type VoteWithCandidateAndAttendee = Prisma.VotesGetPayload<{
  include: {
    candidate: { include: { position: true } };
    attendee: true;
  };
}>;

type TParams = {
  params: { electionId: number; id: number };
};
/**
 * Utility function to map candidate details.
 */
const mapCandidates = (candidates: CandidateWithVotesAndPosition[]) =>
  candidates.map((candidate) => ({
    id: candidate.id,
    candidateId: candidate.id,
    candidateName: `${candidate.firstName}, ${candidate.lastName}`,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    picture: candidate.picture ?? "/images/default-avatar.png",
    position: candidate.position.positionName,
    votes: candidate.votes.length,
  }));
/**
 * for process votes and structure them per voter.
 */
const processVotes = (
  votes: VoteWithCandidateAndAttendee[],
  candidatesResult: TReportCandidate[]
) => {
  const processedVotes = votes.reduce(
    (acc, vote) => {
      const { id: voterId } = vote.attendee;
      const candidateId = vote.candidateId;
      const voterName = `${vote.attendee.lastName}, ${vote.attendee.firstName}`;

      const voterIndex = acc.findIndex((v: { id: any }) => v.id === voterId);
      const candidateIndex = candidatesResult.findIndex(
        (candidate) => candidate.candidateId === candidateId
      );

      if (voterIndex === -1) {
        const voterVotes = new Array(candidatesResult.length).fill(0);
        if (candidateIndex !== -1) voterVotes[candidateIndex] = 1;
        acc.push({ id: voterId, voterName, votes: voterVotes });
      } else if (candidateIndex !== -1) {
        acc[voterIndex].votes[candidateIndex] += 1;
      }

      return acc;
    },
    [] as { id: string; voterName: string; votes: number[] }[]
  );

  return processedVotes;
};

/**
 * ✅ Utility function to calculate total votes per candidate.
 */
const calculateTotalVotes = (modifiedVotes: any[], candidateCount: number) => {
  const totalVotes = new Array(candidateCount).fill(0);
  modifiedVotes.forEach((voter) =>
    voter.votes.forEach((vote: number, index: number) => {
      totalVotes[index] += vote;
    })
  );
  return totalVotes;
};

/**
 * ✅ Main GET handler for election voting data.
 */
export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const id = Number(params.electionId);
    validateId(id);

    const [candidates, votes] = await Promise.all([
      db.candidate.findMany({
        where: { electionId: id },
        include: { votes: true, position: true },
        orderBy: { id: "asc" },
      }),
      db.votes.findMany({
        where: { electionId: id },
        include: {
          candidate: { include: { position: true } },
          attendee: true,
        },
      }),
    ]);

    const candidatesByPosition = candidates.reduce(
      (acc, candidate) => {
        const positionName = candidate.position.positionName;
        if (!acc[positionName]) {
          acc[positionName] = [];
        }
        acc[positionName].push(candidate);
        return acc;
      },
      {} as Record<string, CandidateWithVotesAndPosition[]>
    );

    const groupedCandidatesArray = Object.values(candidatesByPosition).flat();

    const candidatesResult = mapCandidates(groupedCandidatesArray);
    const modifiedVotes = processVotes(votes, candidatesResult);
    const totalVotesPerCandidate = calculateTotalVotes(
      modifiedVotes,
      candidatesResult.length
    );
    const sumOfTotalVotes = totalVotesPerCandidate.reduce(
      (sum, votes) => sum + votes,
      0
    );

    return NextResponse.json({
      total: totalVotesPerCandidate,
      voters: modifiedVotes,
      candidates: candidatesResult,
      sum: sumOfTotalVotes,
    });
  } catch (error) {
    return routeErrorHandler(error, req);
  }
};
