import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = await eventIdParamSchema.parseAsync(params);
    const { passbookNumber, nameSearch, reason } =
      memberAttendeeSearchSchema.parse(await req.json());

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { election: true },
    });

    if (!event) throw new Error("Event does not exist.");

    // Determine the "Mode" based on settings, but we search anyway
    const isBdayRequired =
      reason === "registration"
        ? event.requireBirthdayVerification
        : event.election?.allowBirthdayVerification || false;

    const isOTPRequired =
      reason === "voting"
        ? event.election?.allowOTPVerification || false
        : false;

    const commonSelect = {
      id: true,
      firstName: true,
      passbookNumber: true,
      middleName: true,
      lastName: true,
      contact: true,
      picture: true,
      registered: true,
      voted: true,
      surveyed: true,
      emailAddress: true,
      birthday: true,
      otpSent: true,
    };

    let result = [];

    if (passbookNumber && passbookNumber.length >= 1) {
      result = await db.eventAttendees.findMany({
        select: commonSelect,
        where: { eventId, passbookNumber },
      });
    } else if (nameSearch && nameSearch.length >= 1) {
      const [lastName, firstName] = nameSearch.split(", ");
      result = await db.eventAttendees.findMany({
        select: commonSelect,
        where: {
          eventId,
          AND: [
            { firstName: { contains: firstName?.trim(), mode: "insensitive" } },
            { lastName: { equals: lastName?.trim(), mode: "insensitive" } },
          ],
        },
      });
    } else {
      return NextResponse.json(
        { message: "Search criteria missing" },
        { status: 400 },
      );
    }

    if (result.length === 0)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );

    // Map the results and attach the "Rules" for the frontend
    const response = result.map((attendee) => ({
      ...attendee,
      verificationContext: {
        requiresBirthday: isBdayRequired,
        requiresOTP: isOTPRequired,
        reason: reason, // 'registration' or 'voting'
      },
    }));

    return NextResponse.json(response);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
