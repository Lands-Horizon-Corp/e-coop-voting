import { SignJWT } from "jose";
import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { voterVerificationSchema } from "@/validation-schema/event-registration-voting";
import { TVoteAuthorizationPayload } from "@/types";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { isSameDayIgnoreTimezone } from "@/lib/utils";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = eventIdParamSchema.parse(params);
    const { otp, birthday, passbookNumber } = voterVerificationSchema.parse(
      await req.json(),
    );

    const election = await db.election.findUnique({
      where: { eventId },
    });

    if (!election || election.status !== "live")
      return NextResponse.json(
        { message: "Voting is not yet open" },
        { status: 403 },
      );

    const voter = await db.eventAttendees.findUnique({
      where: { eventId_passbookNumber: { eventId, passbookNumber } },
    });

    if (!voter)
      return NextResponse.json(
        { message: "Voter not found." },
        { status: 404 },
      );

    if (voter.voted)
      return NextResponse.json(
        { message: "You already voted" },
        { status: 403 },
      );

    // --- 1. OTP VERIFICATION LAYER ---
    // Only verify OTP if the election requires it AND the voter has an OTP assigned
    if (election.allowOTPVerification && voter.voteOtp !== null) {
      if (!otp || voter.voteOtp !== otp) {
        return NextResponse.json({ message: "Invalid OTP" }, { status: 403 });
      }
    }

    // --- 2. BIRTHDAY VERIFICATION LAYER ---
    // Only verify Birthday if enabled AND the voter has a birthday on record
    if (election.allowBirthdayVerification && voter.birthday !== null) {
      if (!birthday || !isSameDayIgnoreTimezone(voter.birthday, birthday)) {
        return NextResponse.json(
          { message: "Invalid birthdate, please try again" },
          { status: 400 },
        );
      }
    }

    // --- 3. ELIGIBILITY CHECKS ---
    if (election.voteEligibility === "REGISTERED" && !voter.registered)
      return NextResponse.json(
        { message: "Sorry, you are not registered" },
        { status: 403 },
      );

    if (election.voteEligibility === "MARKED_CANVOTE" && !voter.canVote)
      return NextResponse.json(
        { message: "Sorry, you are not marked as 'can vote'" },
        { status: 403 },
      );

    // --- 4. AUTHORIZATION ---
    const authorizationContent: TVoteAuthorizationPayload = {
      eventId,
      electionId: election.id,
      attendeeId: voter.id,
      passbookNumber: voter.passbookNumber,
      assisted: true,
    };

    const voterAuthorization = await new SignJWT(authorizationContent)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("ace-system")
      .sign(new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET));

    const response = NextResponse.json(
      {
        id: voter.id,
        firstName: voter.firstName,
        passbookNumber: voter.passbookNumber,
        lastName: voter.lastName,
        voted: voter.voted,
      },
      { status: 200 },
    );

    response.cookies.set("v-auth", voterAuthorization, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
