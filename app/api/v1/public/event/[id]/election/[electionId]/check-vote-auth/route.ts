import db from "@/lib/database";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { TVoteAuthorizationPayload } from "@/types";
import { eventElectionParamsSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number; electionId: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const vauth = req.cookies.get("v-auth")?.value;

        if (!vauth)
            return NextResponse.json(
                {
                    message:
                        "You don't have authorization to vote, please retry the voting process (Member verification)",
                },
                { status: 403 }
            );

        const verifiedJwt = await jwtVerify<TVoteAuthorizationPayload>(
            vauth,
            new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET)
        );

        const { id: paramsEventId, electionId: paramsElectionId } =
            eventElectionParamsSchema.parse(params);

        const { attendeeId, eventId, electionId } = verifiedJwt.payload;

        if (eventId !== paramsEventId || electionId !== paramsElectionId)
            return NextResponse.json({ message: "Your vote authorization is not for this election, please go back to your assigned election" }, { status : 403 });

        if (!attendeeId)
            return NextResponse.json(
                {
                    message:
                        "There's a problem with your authorization, please retry voter member verification again.",
                },
                { status: 400 }
            );

        const voter = await db.eventAttendees.findUnique({
            where: { id: attendeeId },
            select: {
                firstName: true,
                middleName: true,
                lastName: true,
                contact: true,
                picture: true,
                registered: true,
                voted: true,
            },
        });

        if (!voter)
            return NextResponse.json(
                { message: "Sorry we can't identify who you are" },
                { status: 404 }
            );

        if (voter?.voted) {
            const response = NextResponse.json(
                { message: "You already voted" },
                { status: 403 }
            );
            response.cookies.delete("v-auth");
            return response;
        }

        return NextResponse.json(voter);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};
