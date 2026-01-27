import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { revokeClaimAuth, validateClaimAuth } from "../service";

type TParams = { params: { id: number } };

export const DELETE = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id } = eventIdParamSchema.parse(params);

        const { attendeeId } = await validateClaimAuth(req, id);

        const member = await db.eventAttendees.findUnique({
            where: { id: attendeeId },
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                contact: true,
                picture: true,
                passbookNumber: true,
                registered: true,
                voted: true
            }
        });

        const response = NextResponse.json(member);
        revokeClaimAuth(response);

        return response;
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
