import { SignJWT } from "jose";
import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import {
    eventElectionParamsSchema,
    voterVerificationSchema,
} from "@/validation-schema/event-registration-voting";
import { TVoteAuthorizationPayload } from "@/types";
import { isSameDayIgnoreTimezone } from "@/lib/utils";

type TParams = { params: { id: number; passbookNumber: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId, electionId } =
            eventElectionParamsSchema.parse(params);
        const { otp, birthday, passbookNumber } = voterVerificationSchema.parse(
            await req.json()
        );

        const election = await db.election.findUnique({
            where: { eventId, id: electionId },
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
                { message: "You are not on the list for verification." },
                { status: 404 }
            );

        if (voter.voted)
            return NextResponse.json(
                { message: "You already voted" },
                { status: 403 }
            );

        if (!otp && !birthday)
            return NextResponse.json(
                { message: `Invalid verification, please provide OTP ${election.allowBirthdayVerification ? 'or Birthday' : ''}` },
                { status: 403 }
            );

        if (otp === undefined) {
            if (voter.birthday === null) {
                return NextResponse.json(
                    {
                        message:
                            "You don't have a birthday defined in our record, use OTP instead, or contact admin/staff.",
                    },
                    { status: 400 }
                );
            }

            const isBirthdayValid =
                birthday && isSameDayIgnoreTimezone(voter.birthday, birthday);



            console.log("Comparing birthdays...");
            console.log("Voter birthday (from DB):", voter.birthday);
            console.log("Input birthday:", birthday);
            console.log("Is birthday valid:", isBirthdayValid);

            if (!isBirthdayValid) {
                return NextResponse.json(
                    { message: "Invalid verification. incorrect Birthday" },
                    { status: 400 }
                );
            }
        } else {
            const isOtpValid = otp && otp.length === 6 && otp === voter.voteOtp;
            if (!isOtpValid) {
                return NextResponse.json(
                    { message: "Invalid verification. incorrect OTP" },
                    { status: 400 }
                );
            }
        }

        if (election.voteEligibility === "REGISTERED" && !voter.registered)
            return NextResponse.json(
                { message: "Sorry, you are not registered" },
                { status: 403 }
            );

        if (election.voteEligibility === "MARKED_CANVOTE" && !voter.canVote)
            return NextResponse.json(
                { message: "Sorry, you are not marked as 'can vote'" },
                { status: 403 }
            );

        const authorizationContent: TVoteAuthorizationPayload = {
            eventId,
            electionId,
            attendeeId: voter.id,
            passbookNumber: voter.passbookNumber,
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
