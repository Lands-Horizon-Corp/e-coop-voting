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
    const { id: eventId, electionId } = eventElectionParamsSchema.parse(params);
    const { otp, birthday, passbookNumber } = voterVerificationSchema.parse(
      await req.json(),
    );

    const election = await db.election.findUnique({
      where: { eventId, id: electionId },
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

    // --- NEW FLEXIBLE VERIFICATION LOGIC ---

    const otpEnabled = !!election.allowOTPVerification;
    const bdayEnabled = !!election.allowBirthdayVerification;

    // If at least one verification method is required by settings
    if (otpEnabled || bdayEnabled) {
      // Check OTP if provided and enabled
      if (otp && otpEnabled) {
        if (otp !== voter.voteOtp) {
          return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }
      }
      // Check Birthday if provided and enabled
      else if (birthday && bdayEnabled) {
        if (
          !voter.birthday ||
          !isSameDayIgnoreTimezone(voter.birthday, birthday)
        ) {
          return NextResponse.json(
            { message: "Invalid Birthday" },
            { status: 400 },
          );
        }
      }
      // If settings require verification but neither was provided (or provided was disabled)
      else {
        const methods = [];
        if (otpEnabled) methods.push("OTP");
        if (bdayEnabled) methods.push("Birthday");

        return NextResponse.json(
          {
            message: `Verification required. Please provide: ${methods.join(" or ")}`,
          },
          { status: 400 },
        );
      }
    }

    // --- If both were false, code skips straight to here (Passbook only mode) ---

    // --- ELIGIBILITY CHECKS ---
    if (election.voteEligibility === "REGISTERED" && !voter.registered)
      return NextResponse.json(
        { message: "Sorry, you are not registered" },
        { status: 403 },
      );

    if (election.voteEligibility === "MARKED_CANVOTE" && !voter.canVote)
      return NextResponse.json(
        { message: "Sorry, you are not authorized to vote." },
        { status: 403 },
      );

    // --- JWT GENERATION & COOKIE SETTING ---
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
      .sign(new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET));

    const response = NextResponse.json(
      {
        id: voter.id,
        firstName: voter.firstName,
        lastName: voter.lastName,
        passbookNumber: voter.passbookNumber,
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
