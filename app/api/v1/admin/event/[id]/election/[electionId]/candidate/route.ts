import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCreateCandidate } from "@/types";
import { createCandidateSchema } from "@/validation-schema/candidate";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { validateId } from "@/lib/server-utils";
import { TCandidate } from "@/types";
import { z } from "zod";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TCreateCandidateParams = {
    params: { id: number; electionId: number; candidateId: number };
};
export const POST = async (
    req: NextRequest,
    { params }: TCreateCandidateParams
) => {
    try {
        const candidate: TCreateCandidate = await req.json();
        createCandidateSchema.parse(candidate);

        z.string().parse(candidate.passbookNumber);

        const { id: eventId } = await eventIdParamSchema.parseAsync(params);

        validateId(eventId);

        const getMemberAttendees = await db.eventAttendees.findMany({
            where: {
                eventId: Number(eventId),
            },
        });

        const isExistOnMigs = getMemberAttendees.find(
            (e) => e.passbookNumber === candidate.passbookNumber
        );

        if (!!isExistOnMigs == false) {
            throw new Error(
                "The candidate must either exist among the members or be a member of MIGS"
            );
        }
        const createCandidate = await db.candidate.create({
            data: {
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                passbookNumber: candidate.passbookNumber,
                picture: candidate.picture,
                election: {
                    connect: {
                        id: candidate.electionId,
                    },
                },
                position: {
                    connect: {
                        id: candidate.positionId,
                    },
                },
            },
        });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });

        return NextResponse.json(createCandidate);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};

type TParams = {
    params: { id: number; electionId: number };
};

type candidateValue = {
    candidateId: number;
    value: number;
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const electionId = Number(params.electionId);
        const positions = await db.position.findMany({
            where: {
                electionId: electionId,
            },
            include: {
                candidates: {
                    include: {
                        votes: {
                            include: {
                                attendee: true,
                                candidate: true,
                            },
                        },
                    },
                },
            },
        });

        const electionResults = positions.map((position) => {
            const voters: { id: number; votersName: string }[] = [];
            const candidates: { id: number; candidateName: string }[] = [];

            position.candidates.forEach((candidate) => {
                candidates.push({
                    id: candidate.id,
                    candidateName: `${candidate.lastName}, ${candidate.firstName}`,
                });
            });

            position.candidates.forEach((candidate) => {
                candidates.push({
                    id: candidate.id,
                    candidateName: `${candidate.lastName}, ${candidate.firstName}`,
                });

                candidate.votes.forEach((vote) => {
                    const votersName = `${vote.attendee.lastName} ${vote.attendee.firstName}`;
                    const id = vote.candidateId;
                    voters.push({ id, votersName });
                });
            });

            const candidatesData = position.candidates.map((candidate) => {
                const totalVotes = candidate.votes.length;

                return {
                    ...candidate,
                    bargraphNumerics: `${candidate.firstName} ${candidate.lastName} (${totalVotes})`,
                    piegraphNumerics: `(${totalVotes}) ${candidate.firstName} ${candidate.lastName}`,
                    totalVotes,
                };
            });

            return {
                id: position.id,
                positionName: position.positionName,
                dataSets: candidatesData.map(
                    (candidateData) => candidateData.totalVotes
                ),
                bargraphNumerics: candidatesData.map(
                    (candidateData) => candidateData.bargraphNumerics
                ),
                piegraphNumerics: candidatesData.map(
                    (candidateData) => candidateData.piegraphNumerics
                ),
            };
        });

        const results = electionResults.sort((a, b) => a.id - b.id);

        return NextResponse.json(results);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};
