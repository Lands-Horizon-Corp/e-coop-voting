import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { createClaimAuth } from "../service";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";
import { isSameDayIgnoreTimezone } from "@/lib/utils";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = eventIdParamSchema.parse(params);
    const { passbookNumber, otp, birthday } =
      createPublicClaimAuthorizationSchema.parse(await req.json());

    // 1. Check if at least one verification method is provided
    if (!otp && !birthday) {
      return NextResponse.json(
        { message: "Invalid verification, please provide OTP or Birthday" },
        { status: 403 },
      );
    }

    // 2. Fetch the member by passbookNumber first
    const member = await db.eventAttendees.findUnique({
      where: {
        eventId_passbookNumber: { eventId, passbookNumber },
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
        surveyed: true,
        voted: true,
        voteOtp: true, // Need this to verify manually
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );
    }

    // 3. Verification Logic
    if (otp) {
      // Verify via OTP
      if (member.voteOtp !== otp) {
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
      }
    } else if (birthday) {
      // Verify via Birthday
      if (!member.birthday) {
        return NextResponse.json(
          {
            message:
              "You don't have a birthday in our record. Use OTP instead.",
          },
          { status: 400 },
        );
      }

      const isBirthdayValid = isSameDayIgnoreTimezone(
        member.birthday,
        birthday,
      );

      if (!isBirthdayValid) {
        return NextResponse.json(
          { message: "Invalid Birthday" },
          { status: 400 },
        );
      }
    }

    // 4. Success - Set cookies and return
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
