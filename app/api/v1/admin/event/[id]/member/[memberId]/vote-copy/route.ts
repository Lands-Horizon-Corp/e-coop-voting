import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdandMemberIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number; memberId: string } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const user = await currentUserOrThrowAuthError();
    if (user.role !== Role.admin && user.role !== Role.root) {
      return NextResponse.json(
        { message: "You are not authorized to view vote copies." },
        { status: 403 },
      );
    }

    const { id: eventId, memberId } =
      await eventIdandMemberIdParamSchema.parseAsync(params);

    const attendee = await db.eventAttendees.findFirst({
      where: { id: memberId, eventId, voted: true },
      select: {
        firstName: true,
        lastName: true,
        passbookNumber: true,
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            category: true,
            election: {
              select: {
                id: true,
                positions: {
                  select: { id: true, positionName: true },
                },
              },
            },
          },
        },
        votes: {
          select: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                positionId: true,
              },
            },
          },
        },
      },
    });

    if (
      !attendee ||
      attendee.event.category !== "election" ||
      !attendee.event.election
    ) {
      return NextResponse.json(
        { message: "Vote copy not found for this election member." },
        { status: 404 },
      );
    }

    const votes = attendee.event.election.positions.map((position) => ({
      positionName: position.positionName,
      votedCandidates: attendee.votes
        .map(({ candidate }) => candidate)
        .filter((candidate) => candidate.positionId === position.id)
        .map(({ id, firstName, lastName }) => ({ id, firstName, lastName })),
    }));

    if (attendee.votes.length === 0) {
      return NextResponse.json(
        { message: "No saved vote selections are available for this member." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      event: {
        id: attendee.event.id,
        title: attendee.event.title,
        date: attendee.event.date,
        location: attendee.event.location,
      },
      electionId: attendee.event.election.id,
      fullName: `${attendee.firstName} ${attendee.lastName}`,
      passbookNumber: attendee.passbookNumber,
      votes,
    });
  } catch (error) {
    return routeErrorHandler(error, req);
  }
};
