import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { createClaimAuth } from "../service";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const { passbookNumber, otp } =
            createPublicClaimAuthorizationSchema.parse(await req.json());

        const member = await db.eventAttendees.findUnique({
            where: {
                eventId_passbookNumber: { eventId, passbookNumber },
                voteOtp: otp,
            },
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                contact: true,
                birthday: true,
                picture: true,
                passbookNumber: true,
                registered: true,
                surveyed : true,
                voted: true,
            },
        });

        if (!member)
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 404 }
            );

        const response = NextResponse.json(member);
        createClaimAuth(response, eventId, member);

        response.cookies.set("recent-user", member.passbookNumber, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return response;
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
