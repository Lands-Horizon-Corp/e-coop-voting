import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { validateId } from "@/lib/server-utils";
import { routeErrorHandler } from "@/errors/route-error-handler";

type TParams = { params: { id: number; electionId?: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = Number(params.id);
        validateId(eventId);
        const getElection = await db.election.findUnique({
            where: {
                eventId: eventId,
            },
        });
        return NextResponse.json(getElection);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
