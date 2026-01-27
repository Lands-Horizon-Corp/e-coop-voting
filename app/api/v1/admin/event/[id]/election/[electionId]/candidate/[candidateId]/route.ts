import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createCandidateSchema } from "@/validation-schema/candidate";
import { Prisma } from "@prisma/client";
import { eventIdParamSchema } from "@/validation-schema/api-params";
type TParams = {
    params: { id: number; electionId: number; candidateId: number };
};

//delete candidate
export const DELETE = async function name(
    req: NextRequest,
    { params }: TParams
) {
    try {
        const candidateId = Number(params.candidateId);
        validateId(candidateId);

        const { id: eventId } = await eventIdParamSchema.parseAsync(params);

        const deleteCandidate = await db.candidate.delete({
            where: { id: candidateId },
        });

        await db.event.update({
            where: { id: eventId },
            data: { subUpdatedAt: new Date() },
        });
        return NextResponse.json(deleteCandidate);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003")
                return NextResponse.json(
                    {
                        message:
                            "Conflict on delete: Voting has already started; you are not allowed to delete this candidate.",
                    },
                    { status: 409 }
                );
        }
        return routeErrorHandler(e, req);
    }
};

//get many candidate based on id
export const GET = async function name(req: NextRequest, { params }: TParams) {
    try {
        const electionId = Number(params.candidateId);
        validateId(electionId);
        const getAllCandidate = await db.candidate.findMany({
            where: {
                electionId: electionId,
            },
            include: {
                position: true,
            },
        });
        return NextResponse.json(getAllCandidate);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};
//update specific candidate
export const PATCH = async function name(
    req: NextRequest,
    { params }: TParams
) {
    try {
        const candidateId = Number(params.candidateId);
        const candidate = await req.json();
        createCandidateSchema.parse(candidate);
        validateId(candidateId);
        const updatedCandidate = await db.candidate.update({
            where: { id: candidateId },
            data: {
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                passbookNumber: candidate.passbookNumber,
                picture: candidate.picture,
                election: {
                    connect: {
                        id: candidate.electionId,
                    },
                    update: {
                        event: {
                            update: {
                                subUpdatedAt: new Date(),
                            },
                        },
                    },
                },
                position: {
                    connect: {
                        id: candidate.positionId,
                    },
                },
            },
        });
        return NextResponse.json(updatedCandidate);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};
