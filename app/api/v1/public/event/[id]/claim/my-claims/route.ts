import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { validateClaimAuth } from "../service";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);

        const { eventId, attendeeId } = await validateClaimAuth(req, id);

        const myClaims = await db.incentiveClaims.findMany({
            where : {
                eventId,
                eventAttendeeId : attendeeId
            },
            include: {
                incentive: {
                    select : {
                        id: true,
                        itemName: true
                    }
                },
                assistedBy: {
                    select: {
                        id: true,
                        picture: true,
                        name: true,
                        email: true,
                    },
                },
            }
        })

        return NextResponse.json(myClaims)
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
