import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number; electionId: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Scrub the input
    const rawSearch = searchParams.get("search")?.trim() || "";

    // Cleaning logic
    const cleanSearch = rawSearch
      .replace(/,/g, " ")
      .replace(/[\u0000-\u001F]/g, "")
      .trim();

    const searchKeywords = cleanSearch.split(/\s+/).filter(Boolean);

    const eventId = eventIdSchema.parse(params.id);
    const electionId = eventIdSchema.parse(params.electionId);

    // 2. Get candidates to exclude
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
                  contains: cleanSearch,
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
                    {
                      middleName: {
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

    // 4. Query
    const filteredEventAttendees = await db.eventAttendees.findMany({
      where: {
        eventId,
        NOT: { passbookNumber: { in: candidatePassbooks } },
        ...searchFilter,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
    return NextResponse.json(filteredEventAttendees);
  } catch (e) {
    console.error("Search Route Error:", e);
    return routeErrorHandler(e, req);
  }
};
