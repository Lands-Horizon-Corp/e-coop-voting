import { SignJWT } from "jose";
import db from "@/lib/database";
import { isSameDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { voterVerificationSchema } from "@/validation-schema/event-registration-voting";
import { TVoteAuthorizationPayload } from "@/types";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id : eventId } = eventIdParamSchema.parse(params)

        const { otp, birthday, passbookNumber } = voterVerificationSchema.parse( await req.json() );

        const election = await db.election.findUnique({
            where: { eventId },
        });

        if (election?.status !== "live")
            return NextResponse.json(
                { message: "Voting is not yet open" },
                { status: 403 }
            );

        const voter = await db.eventAttendees.findUnique({
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
        });

        if (!voter)
            return NextResponse.json(
                { message: "You are not on the list, for verification." },
                { status: 404 }
            );

        if (voter.voted)
            return NextResponse.json(
                { message: "You already voted" },
                { status: 403 }
            );

        if (voter.voteOtp == null || voter.voteOtp !== otp)
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 403 }
            );

        // DUE TO CHANGES / REQUEST of client,
        //
        // 1st feature before was that birthday should be used
        // as 2nd verification for registration and voting.
        //
        // suddenly birthday should be optional said by client so even though the birthday is
        // STRICTLY required for registration as verification it was implemented instead,

        // And for voting verification birthday is used as 2nd option aside OTP but optional
        // and can be toggled on election settings to be used as 2nd layer of authorization before
        // the system give vote authorization

        // Regardless, it was implemented instead, so I wrap it to skip all member who dont have date
        // of birth even if the elction settings require birthday. 
        if (election.allowBirthdayVerification && voter.birthday !== null) {
            if (!birthday || !isSameDay(voter.birthday, birthday))
                return NextResponse.json(
                    { message: "Invalid birthdate, please try again" },
                    { status: 400 }
                );
        }

        if (election.voteEligibility === "REGISTERED" && !voter.registered)
            return NextResponse.json(
                { message: "Sorry you are not registered" },
                { status: 403 }
            );

        if (election.voteEligibility === "MARKED_CANVOTE" && !voter.canVote)
            return NextResponse.json(
                { message: "Sorry you are not marked as 'can vote'" },
                { status: 403 }
            );

        const authorizationContent: TVoteAuthorizationPayload = {
            eventId,
            electionId : election.id,
            attendeeId: voter.id,
            passbookNumber: voter.passbookNumber,
            assisted : true
        };

        const voterAuthorization = await new SignJWT(authorizationContent)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setIssuer("ace-system")
            .sign(
                new TextEncoder().encode(
                    process.env.VOTING_AUTHORIZATION_SECRET
                )
            );

        const response = NextResponse.json(
            {
                id: voter.id,
                firstName: voter.firstName,
                passbookNumber: voter.passbookNumber,
                middleName: voter.middleName,
                lastName: voter.lastName,
                contact: voter.contact,
                picture: voter.picture,
                registered: voter.registered,
                voted: voter.voted,
            },
            { status: 200 }
        );

        response.cookies.set("v-auth", voterAuthorization, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return response;
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
