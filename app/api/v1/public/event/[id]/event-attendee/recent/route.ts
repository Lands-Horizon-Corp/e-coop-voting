import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = await eventIdParamSchema.parseAsync(params);
    const recentPb = req.cookies.get("recent-user")?.value;

    if (!recentPb)
      return NextResponse.json({ message: "No recent user" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const reason =
      (searchParams.get("reason") as "registration" | "voting") ??
      "registration";

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { election: true },
    });

    if (!event) throw new Error("Event does not exist.");

    const requiresBday =
      reason === "registration"
        ? !!event.requireBirthdayVerification
        : !!event.election?.allowBirthdayVerification;

    const requiresOTP =
      reason === "voting" ? !!event.election?.allowOTPVerification : false;

    const member = await db.eventAttendees.findUnique({
      where: {
        eventId_passbookNumber: {
          passbookNumber: recentPb,
          eventId,
        },
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        contact: true,
        picture: true,
        passbookNumber: true,
        registered: true,
        voted: true,
        surveyed: true,
        birthday: true,
        otpSent: true,
        emailAddress: true,
      },
    });

    if (!member)
      return NextResponse.json({ message: "No recent user" }, { status: 404 });

    return NextResponse.json({
      ...member,
      verificationContext: {
        requiresBirthday: requiresBday,
        requiresOTP: requiresOTP,
        reason,
        isBypassMode: !requiresBday && !requiresOTP,
      },
    });
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
