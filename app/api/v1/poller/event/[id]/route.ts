export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number; electionId?: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = await eventIdParamSchema.parseAsync(params);
        const event = await db.event.findUnique({
            select: { id: true, subUpdatedAt: true },
            where: {
                id,
            },
        });
        return NextResponse.json(event);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
