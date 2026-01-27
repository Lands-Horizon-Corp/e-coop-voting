import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);

        const incentives = await db.incentives.findMany({
            where: { 
                eventId : id,
             },
             select : {
                id : true,
                itemName : true,
                eventId : true,
                claimRequirement : true
             }
        });

        return NextResponse.json(incentives);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
