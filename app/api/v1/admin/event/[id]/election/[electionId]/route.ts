import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { electionSettingSchema } from "@/validation-schema/election-settings";
import { ZodError } from "zod";

type TParams = {
    params: { electionId: number; id: number };
};

export const POST = (req: NextRequest) => {
    return NextResponse.json({ message: "post - ok" });
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const electionId = Number(params.electionId);
        const id = Number(params.id);
        validateId(electionId);
        validateId(id);
        const getElection = await db.election.findUnique({
            where: { id: electionId },
            include: {
                positions: true,
                event: true,
                candidates: {
                    include: {
                        position: true,
                    },
                },
            },
        });
        return NextResponse.json(getElection);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};

export const PATCH = async function name(
    req: NextRequest,
    { params }: TParams
) {
    try {
        const electionId = Number(params.electionId);
        const election = await req.json();
        const parsedSettings = await electionSettingSchema.parseAsync(election);
        const updatedElectionSettings = await db.election.update({
            where: { id: electionId },
            data: parsedSettings,
        });
        return NextResponse.json(updatedElectionSettings);
    } catch (error) {
        if (error instanceof ZodError)
            return NextResponse.json({ message: error }, { status: 400 });
        return routeErrorHandler(error, req);
    }
};
