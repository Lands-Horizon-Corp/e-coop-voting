import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number; electionId: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const searchKeywords = search
      .replace(/,/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const eventId = eventIdSchema.parse(params.id);
    const electionId = eventIdSchema.parse(params.electionId);
    const candidates = await db.candidate.findMany({
      where: { electionId },
      select: { passbookNumber: true },
    });
    const candidatePassbooks = candidates.map((c) => c.passbookNumber);
    const searchFilter =
      searchKeywords.length > 0
        ? {
            OR: [
              {
                passbookNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                AND: searchKeywords.map((word) => ({
                  OR: [
                    {
                      firstName: {
                        contains: word,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      lastName: {
                        contains: word,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                })),
              },
            ],
          }
        : {};

    const filteredEventAttendees = await db.eventAttendees.findMany({
      where: {
        eventId,
        NOT: { passbookNumber: { in: candidatePassbooks } },
        ...searchFilter,
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return NextResponse.json(filteredEventAttendees);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
